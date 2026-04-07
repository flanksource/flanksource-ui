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

  const preselectedSubjectIds = useMemo(() => {
    if (!selectedResource) return [];
    return permissions
      .filter(
        (p) =>
          p.deny !== true &&
          p.subject &&
          p.source === MCP_SETTINGS_PERMISSION_SOURCE &&
          (p.subject_type === "person" ||
            p.subject_type === "team" ||
            p.subject_type === "group" ||
            p.subject_type === "role") &&
          permissionMatchesResource(p, selectedResource, getRefs)
      )
      .map((p) => p.subject!);
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
      subjects: PermissionSubject[];
    }) => {
      // Re-fetch to avoid acting on stale data from the render closure
      const latestPermissions = await fetchPermissions();

      const desiredKeys = new Set(
        subjects.map((s) => `${mapSubjectType(s.type)}:${s.id}`)
      );

      const existingPermissions = latestPermissions.filter(
        (p) =>
          p.action === "mcp:run" &&
          p.deny !== true &&
          p.subject &&
          p.id &&
          (p.subject_type === "person" ||
            p.subject_type === "team" ||
            p.subject_type === "group" ||
            p.subject_type === "role") &&
          p.source === MCP_SETTINGS_PERMISSION_SOURCE &&
          permissionMatchesResource(p, resource, getRefs)
      );

      const existingKeys = new Set(
        existingPermissions.map((p) => `${p.subject_type}:${p.subject}`)
      );

      const resourceSelector = [
        { name: resource.name, namespace: resource.namespace }
      ];

      const payloadsToAdd = subjects
        .map((subject) => {
          const subjectType = mapSubjectType(subject.type);
          if (existingKeys.has(`${subjectType}:${subject.id}`)) {
            return null;
          }
          return {
            object_selector: { [objectSelectorKey]: resourceSelector },
            action: "mcp:run",
            subject: subject.id,
            subject_type: subjectType,
            deny: false,
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

      const deleteIds = existingPermissions
        .filter((p) => !desiredKeys.has(`${p.subject_type}:${p.subject}`))
        .map((p) => p.id!)
        .sort((a, b) => a.localeCompare(b));

      const addedPermissionIds: string[] = [];

      try {
        for (const payload of payloadsToAdd) {
          const created = await addPermission(payload as any);
          if (created?.data?.id) {
            addedPermissionIds.push(created.data.id);
          }
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

      return { added: payloadsToAdd.length, removed: deleteIds.length };
    },
    onSuccess: ({ added, removed }) => {
      if (added === 0 && removed === 0) {
        toastSuccess("No permission changes");
      } else {
        toastSuccess(`Updated permissions: +${added} / -${removed}`);
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
    subjects: PermissionSubject[]
  ) => {
    await allowSelectiveAccessMutation({ resource, subjects });
  };

  // ── Loading state ───────────────────────────────────────────────────

  const loading =
    isResourcesLoading ||
    isPermissionsLoading ||
    isResourcesRefetching ||
    isPermissionsRefetching ||
    isUpdatingGlobalOverride ||
    isAllowingSelective;

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
    loading,
    isInitialLoading,
    preselectedSubjectIds,
    refetch: () => {
      refetchResources();
      refetchPermissions();
    }
  };
}
