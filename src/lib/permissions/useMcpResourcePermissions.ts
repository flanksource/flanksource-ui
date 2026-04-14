import {
  addPermission,
  deletePermission,
  MCP_SETTINGS_PERMISSION_SOURCE,
  PermissionSubject,
  updatePermission
} from "@flanksource-ui/api/services/permissions";
import { PermissionsSummary } from "@flanksource-ui/api/types/permissions";
import {
  toastError,
  toastSuccess
} from "@flanksource-ui/components/Toast/toast";
import { useUser } from "@flanksource-ui/context";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  buildPermissionAccessCardMaps,
  EVERYONE_SUBJECT_ID,
  EVERYONE_SUBJECT_TYPE,
  mapSubjectType,
  NamespacedRef,
  NamespacedResource,
  permissionMatchesResource
} from "./mcpPermissionCardMappings";

export type McpResourcePermissionsConfig<TResource extends NamespacedResource> =
  {
    resources: TResource[];
    isResourcesLoading: boolean;
    isResourcesRefetching: boolean;
    refetchResources: () => void;
    permissionsQueryKey: string[];
    fetchPermissions: () => Promise<PermissionsSummary[]>;
    getRefs: (permission: PermissionsSummary) => NamespacedRef[];
    /** Key used in `object_selector` payloads, e.g. `"playbooks"` or `"views"`. */
    objectSelectorKey: string;
  };

export type SubjectAccessSelection = {
  subject: PermissionSubject;
  access: "allow" | "deny";
};

export function useMcpResourcePermissions<
  TResource extends NamespacedResource
>({
  resources,
  isResourcesLoading,
  isResourcesRefetching,
  refetchResources,
  permissionsQueryKey,
  fetchPermissions,
  getRefs,
  objectSelectorKey
}: McpResourcePermissionsConfig<TResource>) {
  const { user } = useUser();
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(
    null
  );
  const [mutatingResourceId, setMutatingResourceId] = useState<string | null>(
    null
  );
  const [mutatingSubjectId, setMutatingSubjectId] = useState<string | null>(
    null
  );

  // ── Queries ──────────────────────────────────────────────────────────

  const {
    data: permissions = [],
    isLoading: isPermissionsLoading,
    refetch: refetchPermissions,
    isRefetching: isPermissionsRefetching
  } = useQuery({
    queryKey: permissionsQueryKey,
    queryFn: fetchPermissions
  });

  // ── Derived data ────────────────────────────────────────────────────

  const { permissionsByResource, globalOverrideByResource } = useMemo(
    () =>
      buildPermissionAccessCardMaps({
        resources,
        permissions,
        getRefs,
        source: MCP_SETTINGS_PERMISSION_SOURCE,
        everyoneSubjectId: EVERYONE_SUBJECT_ID,
        everyoneSubjectType: EVERYONE_SUBJECT_TYPE
      }),
    [permissions, resources, getRefs]
  );

  const selectedResource = useMemo(
    () => resources.find((r) => r.id === selectedResourceId),
    [resources, selectedResourceId]
  );

  const preselectedSubjectAccess = useMemo(() => {
    const accessBySubjectId: Record<string, "allow" | "deny"> = {};

    if (!selectedResource) {
      return accessBySubjectId;
    }

    for (const permission of permissions) {
      if (
        !permission.subject ||
        permission.source !== MCP_SETTINGS_PERMISSION_SOURCE ||
        (permission.subject_type !== "person" &&
          permission.subject_type !== "team" &&
          permission.subject_type !== "group" &&
          permission.subject_type !== "role") ||
        !permissionMatchesResource(permission, selectedResource, getRefs)
      ) {
        continue;
      }

      const subjectId = permission.subject;
      const nextAccess = permission.deny === true ? "deny" : "allow";
      const currentAccess = accessBySubjectId[subjectId];

      accessBySubjectId[subjectId] =
        currentAccess === "deny" || nextAccess === "deny" ? "deny" : "allow";
    }

    return accessBySubjectId;
  }, [permissions, selectedResource, getRefs]);

  // ── Mutations ───────────────────────────────────────────────────────

  const {
    mutate: setGlobalOverrideMutation,
    isLoading: isUpdatingGlobalOverride
  } = useMutation({
    mutationFn: async ({
      resource,
      override
    }: {
      resource: TResource;
      override: "allow" | "none" | "deny";
    }) => {
      const latestPermissions = await fetchPermissions();

      const matchingOverrides = latestPermissions.filter(
        (p) =>
          p.action === "mcp:run" &&
          p.subject_type === EVERYONE_SUBJECT_TYPE &&
          p.subject === EVERYONE_SUBJECT_ID &&
          p.id &&
          p.source === MCP_SETTINGS_PERMISSION_SOURCE &&
          permissionMatchesResource(p, resource, getRefs)
      );

      if (override === "none") {
        await Promise.all(matchingOverrides.map((p) => deletePermission(p.id)));
        return;
      }

      const targetDeny = override === "deny";
      const [canonicalOverride, ...duplicateOverrides] = matchingOverrides;

      if (duplicateOverrides.length > 0) {
        await Promise.all(
          duplicateOverrides.map((p) => deletePermission(p.id))
        );
      }

      if (canonicalOverride) {
        if (canonicalOverride.deny !== targetDeny) {
          await updatePermission({
            id: canonicalOverride.id,
            deny: targetDeny
          } as any);
        }
        return;
      }

      await addPermission({
        object_selector: {
          [objectSelectorKey]: [
            { name: resource.name, namespace: resource.namespace }
          ]
        },
        action: "mcp:run",
        subject: EVERYONE_SUBJECT_ID,
        subject_type: EVERYONE_SUBJECT_TYPE,
        deny: targetDeny,
        source: MCP_SETTINGS_PERMISSION_SOURCE,
        created_by: user?.id
      } as any);
    },
    onSettled: () => {
      refetchPermissions();
    },
    onError: (error) => {
      toastError(error as any);
    }
  });

  const {
    mutateAsync: allowSelectiveAccessMutation,
    isLoading: isAllowingSelective
  } = useMutation({
    mutationFn: async ({
      resource,
      subjects
    }: {
      resource: TResource;
      subjects: PermissionSubject[] | SubjectAccessSelection[];
    }) => {
      // Re-fetch to avoid acting on stale data from the render closure
      const latestPermissions = await fetchPermissions();

      const normalizedSelections: SubjectAccessSelection[] = (
        subjects as Array<PermissionSubject | SubjectAccessSelection>
      ).map((entry) => {
        if ("subject" in entry) {
          return entry;
        }

        return {
          subject: entry,
          access: "allow"
        };
      });

      const desiredAccessByKey = new Map<string, "allow" | "deny">(
        normalizedSelections.map((selection) => [
          `${mapSubjectType(selection.subject.type)}:${selection.subject.id}`,
          selection.access
        ])
      );

      const existingPermissions = latestPermissions.filter(
        (p) =>
          p.action === "mcp:run" &&
          p.subject &&
          p.id &&
          (p.subject_type === "person" ||
            p.subject_type === "team" ||
            p.subject_type === "group" ||
            p.subject_type === "role") &&
          p.source === MCP_SETTINGS_PERMISSION_SOURCE &&
          permissionMatchesResource(p, resource, getRefs)
      );

      const existingByKey = new Map<string, typeof existingPermissions>();

      for (const permission of existingPermissions) {
        const key = `${permission.subject_type}:${permission.subject}`;
        const list = existingByKey.get(key) ?? [];
        list.push(permission);
        existingByKey.set(key, list);
      }

      const resourceSelector = [
        { name: resource.name, namespace: resource.namespace }
      ];

      const payloadsToAdd = normalizedSelections
        .map((selection) => {
          const subjectType = mapSubjectType(selection.subject.type);
          const key = `${subjectType}:${selection.subject.id}`;
          if (existingByKey.has(key)) {
            return null;
          }
          return {
            object_selector: { [objectSelectorKey]: resourceSelector },
            action: "mcp:run",
            subject: selection.subject.id,
            subject_type: subjectType,
            deny: selection.access === "deny",
            source: MCP_SETTINGS_PERMISSION_SOURCE,
            created_by: user?.id
          };
        })
        .filter((payload): payload is NonNullable<typeof payload> => !!payload)
        .sort((a, b) =>
          `${a.subject_type}:${a.subject}`.localeCompare(
            `${b.subject_type}:${b.subject}`
          )
        );

      const updatePayloads = Array.from(existingByKey.entries())
        .map(([key, permissionsForSubject]) => {
          const desiredAccess = desiredAccessByKey.get(key);

          if (!desiredAccess) {
            return null;
          }

          const [primary, ...duplicates] = permissionsForSubject;
          if (!primary?.id) {
            return null;
          }

          const shouldDeny = desiredAccess === "deny";
          const requiresUpdate =
            primary.deny === true ? !shouldDeny : shouldDeny;

          return {
            id: primary.id,
            deny: shouldDeny,
            requiresUpdate,
            duplicateIds: duplicates
              .map((permission) => permission.id)
              .filter((id): id is string => !!id)
          };
        })
        .filter((entry): entry is NonNullable<typeof entry> => !!entry)
        .sort((a, b) => a.id.localeCompare(b.id));

      const deleteIds = [
        ...existingPermissions
          .filter((permission) => {
            const key = `${permission.subject_type}:${permission.subject}`;
            return !desiredAccessByKey.has(key);
          })
          .map((permission) => permission.id!),
        ...updatePayloads.flatMap((entry) => entry.duplicateIds)
      ].sort((a, b) => a.localeCompare(b));

      const addedPermissionIds: string[] = [];

      try {
        for (const payload of payloadsToAdd) {
          const created = await addPermission(payload as any);
          if (created?.data?.id) {
            addedPermissionIds.push(created.data.id);
          }
        }

        for (const payload of updatePayloads) {
          if (!payload.requiresUpdate) {
            continue;
          }

          await updatePermission({
            id: payload.id,
            deny: payload.deny
          } as any);
        }

        for (const id of deleteIds) {
          await deletePermission(id);
        }
      } catch (error) {
        if (addedPermissionIds.length > 0) {
          await Promise.allSettled(
            addedPermissionIds.map((id) => deletePermission(id))
          );
        }
        throw error;
      }

      return {
        added: payloadsToAdd.length,
        updated: updatePayloads.filter((entry) => entry.requiresUpdate).length,
        removed: deleteIds.length
      };
    },
    onSuccess: ({ added, updated, removed }) => {
      if (added === 0 && updated === 0 && removed === 0) {
        toastSuccess("No permission changes");
      } else {
        toastSuccess(
          `Updated permissions: +${added} / ~${updated} / -${removed}`
        );
      }
      setSelectedResourceId(null);
    },
    onError: (error) => {
      toastError(error as any);
    },
    onSettled: () => {
      refetchPermissions();
    }
  });

  // ── Wrapped handlers (manage mutating-id state internally) ──────────

  const setGlobalOverride = (
    resource: TResource,
    override: "allow" | "none" | "deny"
  ) => {
    setMutatingResourceId(resource.id);
    setGlobalOverrideMutation(
      { resource, override },
      {
        onSettled: () => {
          setMutatingResourceId((cur) => (cur === resource.id ? null : cur));
        }
      }
    );
  };

  const allowSelectiveAccess = async (
    resource: TResource,
    subjects: PermissionSubject[] | SubjectAccessSelection[]
  ) => {
    await allowSelectiveAccessMutation({ resource, subjects });
  };

  const {
    mutateAsync: setSelectiveSubjectAccessMutation,
    isLoading: isSettingSelectiveSubjectAccess
  } = useMutation({
    mutationFn: async ({
      resource,
      subject,
      access
    }: {
      resource: TResource;
      subject: PermissionSubject;
      access: "allow" | "deny" | "default";
    }) => {
      const latestPermissions = await fetchPermissions();
      const subjectType = mapSubjectType(subject.type);

      const existingPermissions = latestPermissions.filter(
        (p) =>
          p.action === "mcp:run" &&
          p.subject === subject.id &&
          p.subject_type === subjectType &&
          p.id &&
          p.source === MCP_SETTINGS_PERMISSION_SOURCE &&
          permissionMatchesResource(p, resource, getRefs)
      );

      if (access === "default") {
        await Promise.all(
          existingPermissions.map((permission) =>
            deletePermission(permission.id!)
          )
        );
        return;
      }

      const shouldDeny = access === "deny";
      const [primary, ...duplicates] = existingPermissions;

      if (!primary) {
        await addPermission({
          object_selector: {
            [objectSelectorKey]: [
              { name: resource.name, namespace: resource.namespace }
            ]
          },
          action: "mcp:run",
          subject: subject.id,
          subject_type: subjectType,
          deny: shouldDeny,
          source: MCP_SETTINGS_PERMISSION_SOURCE,
          created_by: user?.id
        } as any);
      } else if (primary.deny !== shouldDeny) {
        await updatePermission({
          id: primary.id,
          deny: shouldDeny
        } as any);
      }

      if (duplicates.length > 0) {
        await Promise.all(
          duplicates
            .map((permission) => permission.id)
            .filter((id): id is string => !!id)
            .map((id) => deletePermission(id))
        );
      }
    },
    onError: (error) => {
      toastError(error as any);
    },
    onSettled: () => {
      refetchPermissions();
    }
  });

  const setSelectiveSubjectAccess = async (
    resource: TResource,
    subject: PermissionSubject,
    access: "allow" | "deny" | "default"
  ) => {
    setMutatingSubjectId(subject.id);
    try {
      await setSelectiveSubjectAccessMutation({ resource, subject, access });
    } finally {
      setMutatingSubjectId((cur) => (cur === subject.id ? null : cur));
    }
  };

  // ── Loading state ───────────────────────────────────────────────────

  const loading =
    isResourcesLoading ||
    isPermissionsLoading ||
    isResourcesRefetching ||
    isPermissionsRefetching ||
    isUpdatingGlobalOverride ||
    isAllowingSelective ||
    isSettingSelectiveSubjectAccess;

  const isInitialLoading =
    (isResourcesLoading || isPermissionsLoading) && resources.length === 0;

  return {
    permissionsByResource,
    globalOverrideByResource,
    selectedResource,
    setSelectedResourceId,
    mutatingResourceId,
    setGlobalOverride,
    allowSelectiveAccess,
    isAllowingSelective,
    setSelectiveSubjectAccess,
    mutatingSubjectId,
    isSettingSelectiveSubjectAccess,
    loading,
    isInitialLoading,
    preselectedSubjectAccess,
    refetch: () => {
      refetchResources();
      refetchPermissions();
    }
  };
}
