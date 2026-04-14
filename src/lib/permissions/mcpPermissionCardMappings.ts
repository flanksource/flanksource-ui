import {
  INTERACTIVE_SETTINGS_PERMISSION_SOURCE,
  PermissionSubject
} from "@flanksource-ui/api/services/permissions";
import { PermissionsSummary } from "@flanksource-ui/api/types/permissions";

export const EVERYONE_SUBJECT_ID = "everyone";
export const EVERYONE_SUBJECT_TYPE = "group";

/**
 * Map a PermissionSubject type to the subject_type used in permission records.
 */
export function mapSubjectType(type: PermissionSubject["type"]) {
  if (type === "permission_subject_group") {
    return "group" as const;
  }

  if (type === "role") {
    return "role" as const;
  }

  if (type === "access_token_person") {
    return "person" as const;
  }

  return type;
}

export type NamespacedResource = {
  id: string;
  name: string;
  namespace?: string;
};

export type NamespacedRef = {
  name?: string;
  namespace?: string;
};

export type PermissionBuckets = {
  users: PermissionsSummary[];
  groups: PermissionsSummary[];
};

export function buildSubjectLookup(subjects: PermissionSubject[]) {
  return Object.fromEntries(
    subjects.map((subject) => [
      subject.id,
      { name: subject.name, type: subject.type }
    ])
  );
}

export function permissionMatchesResource<TResource extends NamespacedResource>(
  permission: PermissionsSummary,
  resource: TResource,
  getRefs: (permission: PermissionsSummary) => NamespacedRef[]
) {
  const refs = getRefs(permission);

  return refs.some((ref) => {
    if (!ref?.name) {
      return false;
    }

    if (ref.namespace) {
      return ref.namespace === resource.namespace && ref.name === resource.name;
    }

    return ref.name === resource.name;
  });
}

function createResourceIndexes<TResource extends NamespacedResource>(
  resources: TResource[]
) {
  const byNamespacedRef = new Map<string, TResource>();
  const byName = new Map<string, TResource[]>();

  for (const resource of resources) {
    byNamespacedRef.set(
      `${resource.namespace || ""}/${resource.name}`,
      resource
    );

    const existing = byName.get(resource.name) ?? [];
    existing.push(resource);
    byName.set(resource.name, existing);
  }

  return { byNamespacedRef, byName };
}

function resolveResourcesForRef<TResource extends NamespacedResource>(
  ref: NamespacedRef,
  indexes: ReturnType<typeof createResourceIndexes<TResource>>
) {
  if (!ref?.name) {
    return [];
  }

  if (ref.namespace) {
    const matched = indexes.byNamespacedRef.get(`${ref.namespace}/${ref.name}`);
    return matched ? [matched] : [];
  }

  return indexes.byName.get(ref.name) ?? [];
}

export function buildPermissionAccessCardMaps<
  TResource extends NamespacedResource
>({
  resources,
  permissions,
  getRefs,
  action = "mcp:run",
  source = INTERACTIVE_SETTINGS_PERMISSION_SOURCE,
  everyoneSubjectId = "everyone",
  everyoneSubjectType = "group"
}: {
  resources: TResource[];
  permissions: PermissionsSummary[];
  getRefs: (permission: PermissionsSummary) => NamespacedRef[];
  action?: string;
  source?: string;
  everyoneSubjectId?: string;
  everyoneSubjectType?: string;
}) {
  const permissionsByResource = new Map<string, PermissionBuckets>();
  const globalOverrideByResource = new Map<string, "allow" | "none" | "deny">();

  const indexes = createResourceIndexes(resources);

  for (const permission of permissions) {
    const refs = getRefs(permission);
    if (refs.length === 0) {
      continue;
    }

    const matchedResources: TResource[] = [];
    const matchedIds = new Set<string>();

    for (const ref of refs) {
      const resourcesForRef = resolveResourcesForRef(ref, indexes);
      for (const resource of resourcesForRef) {
        if (matchedIds.has(resource.id)) {
          continue;
        }
        matchedIds.add(resource.id);
        matchedResources.push(resource);
      }
    }

    if (matchedResources.length === 0) {
      continue;
    }

    const isGlobalOverride =
      permission.action === action &&
      permission.subject_type === everyoneSubjectType &&
      permission.subject === everyoneSubjectId &&
      permission.source === source;

    if (isGlobalOverride) {
      for (const resource of matchedResources) {
        const next = permission.deny === true ? "deny" : "allow";
        const current = globalOverrideByResource.get(resource.id);
        globalOverrideByResource.set(
          resource.id,
          current === "deny" || next === "deny" ? "deny" : "allow"
        );
      }
      continue;
    }

    if (
      permission.deny === true ||
      (permission.subject_type === everyoneSubjectType &&
        permission.subject === everyoneSubjectId)
    ) {
      continue;
    }

    for (const resource of matchedResources) {
      const current = permissionsByResource.get(resource.id) ?? {
        users: [],
        groups: []
      };

      if (permission.subject_type === "person") {
        current.users.push(permission);
      } else if (
        permission.subject_type === "team" ||
        permission.subject_type === "group" ||
        permission.subject_type === "role"
      ) {
        current.groups.push(permission);
      }

      permissionsByResource.set(resource.id, current);
    }
  }

  return {
    permissionsByResource,
    globalOverrideByResource
  };
}
