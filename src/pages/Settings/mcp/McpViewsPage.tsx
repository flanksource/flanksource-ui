import {
  addPermission,
  deletePermission,
  fetchMcpViewPermissions,
  updatePermission,
  fetchPermissionSubjects,
  PermissionSubject
} from "@flanksource-ui/api/services/permissions";
import { getAllViews, View } from "@flanksource-ui/api/services/views";
import { PermissionsSummary } from "@flanksource-ui/api/types/permissions";
import PermissionAccessCard from "@flanksource-ui/components/MCP/PermissionAccessCard";
import McpTabsLinks from "@flanksource-ui/components/MCP/McpTabsLinks";
import SubjectSelectorModal from "@flanksource-ui/components/MCP/SubjectSelectorModal";
import {
  toastError,
  toastSuccess
} from "@flanksource-ui/components/Toast/toast";
import { useUser } from "@flanksource-ui/context";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

type PermissionBuckets = {
  users: PermissionsSummary[];
  groups: PermissionsSummary[];
};

const EVERYONE_SUBJECT_ID = "everyone";
const EVERYONE_SUBJECT_TYPE = "role";

function permissionMatchesView(permission: PermissionsSummary, view: View) {
  const viewRefs = permission.object_selector?.views ?? [];

  return viewRefs.some((viewRef) => {
    if (!viewRef.name) {
      return false;
    }

    if (viewRef.namespace) {
      return viewRef.namespace === view.namespace && viewRef.name === view.name;
    }

    return viewRef.name === view.name;
  });
}

export default function McpViewsPage() {
  const { user } = useUser();
  const [selectedViewId, setSelectedViewId] = useState<string | null>(null);
  const [mutatingViewId, setMutatingViewId] = useState<string | null>(null);

  const {
    isLoading: isViewsLoading,
    data: viewsResponse,
    refetch: refetchViews,
    isRefetching: isViewsRefetching
  } = useQuery({
    queryKey: ["mcp", "views", "all"],
    queryFn: async () => getAllViews(undefined, 0, 1000)
  });

  const views = viewsResponse?.data ?? [];

  const {
    data: viewPermissions = [],
    isLoading: isPermissionsLoading,
    refetch: refetchPermissions,
    isRefetching: isPermissionsRefetching
  } = useQuery({
    queryKey: ["mcp", "views", "permissions"],
    queryFn: fetchMcpViewPermissions
  });

  const { data: permissionSubjects = [] } = useQuery({
    queryKey: ["mcp", "permission-subjects", "all"],
    queryFn: fetchPermissionSubjects
  });

  const subjectLookup = useMemo(() => {
    return Object.fromEntries(
      permissionSubjects.map((subject) => [
        subject.id,
        { name: subject.name, type: subject.type }
      ])
    );
  }, [permissionSubjects]);

  const { mutate: setGlobalOverride, isLoading: isUpdatingGlobalOverride } =
    useMutation({
      mutationFn: async ({
        view,
        override
      }: {
        view: View;
        override: "allow" | "none" | "deny";
      }) => {
        const existingOverrides = viewPermissions.filter(
          (permission) =>
            permission.action === "mcp:run" &&
            permission.subject_type === EVERYONE_SUBJECT_TYPE &&
            permission.subject === EVERYONE_SUBJECT_ID &&
            permission.id &&
            permission.source === "mcp_settings" &&
            permissionMatchesView(permission, view)
        );

        if (override === "none") {
          await Promise.all(
            existingOverrides.map((permission) =>
              deletePermission(permission.id)
            )
          );
          return;
        }

        const targetDeny = override === "deny";
        const existingOverride = existingOverrides[0];

        if (existingOverride) {
          if (existingOverride.deny !== targetDeny) {
            await updatePermission({
              id: existingOverride.id,
              deny: targetDeny
            } as any);
          }
          return;
        }

        await addPermission({
          object_selector: {
            views: [{ name: view.name, namespace: view.namespace }]
          },
          action: "mcp:run",
          subject: EVERYONE_SUBJECT_ID,
          subject_type: EVERYONE_SUBJECT_TYPE,
          deny: targetDeny,
          source: "mcp_settings",
          created_by: user?.id!
        } as any);
      },
      onSuccess: () => {
        refetchPermissions();
      },
      onError: (error) => {
        toastError(error as any);
      }
    });

  const { mutateAsync: allowSelectiveAccess, isLoading: isAllowingSelective } =
    useMutation({
      mutationFn: async ({
        view,
        subjects
      }: {
        view: View;
        subjects: PermissionSubject[];
      }) => {
        const normalizeSubject = (subject: PermissionSubject) => {
          const subjectType =
            subject.type === "person"
              ? "person"
              : subject.type === "team"
                ? "team"
                : subject.type === "permission_subject_group"
                  ? "group"
                  : null;

          if (!subjectType) {
            return null;
          }

          return `${subjectType}:${subject.id}`;
        };

        const desiredKeys = new Set(
          subjects.map(normalizeSubject).filter(Boolean) as string[]
        );

        const existingPermissions = viewPermissions.filter(
          (permission) =>
            permission.action === "mcp:run" &&
            permission.deny !== true &&
            permission.subject &&
            permission.id &&
            (permission.subject_type === "person" ||
              permission.subject_type === "team" ||
              permission.subject_type === "group") &&
            (permission.source === "mcp_settings" ||
              permission.source === "UI") &&
            permissionMatchesView(permission, view)
        );

        const existingKeys = new Set(
          existingPermissions.map(
            (permission) => `${permission.subject_type}:${permission.subject}`
          )
        );

        const viewSelector = [{ name: view.name, namespace: view.namespace }];

        const payloads = subjects
          .map((subject) => {
            const subjectType =
              subject.type === "person"
                ? "person"
                : subject.type === "team"
                  ? "team"
                  : subject.type === "permission_subject_group"
                    ? "group"
                    : null;

            if (!subjectType) {
              return null;
            }

            const key = `${subjectType}:${subject.id}`;
            if (existingKeys.has(key)) {
              return null;
            }

            return {
              object_selector: { views: viewSelector },
              action: "mcp:run",
              subject: subject.id,
              subject_type: subjectType,
              deny: false,
              source: "mcp_settings" as const,
              created_by: user?.id
            };
          })
          .filter(Boolean);

        const deleteIds = existingPermissions
          .filter(
            (permission) =>
              !desiredKeys.has(
                `${permission.subject_type}:${permission.subject}`
              )
          )
          .map((permission) => permission.id);

        await Promise.all([
          ...payloads.map((payload) => addPermission(payload as any)),
          ...deleteIds.map((id) => deletePermission(id))
        ]);

        return {
          added: payloads.length,
          removed: deleteIds.length
        };
      },
      onSuccess: ({ added, removed }) => {
        if (added === 0 && removed === 0) {
          toastSuccess("No permission changes");
        } else {
          toastSuccess(`Updated permissions: +${added} / -${removed}`);
        }

        setSelectedViewId(null);
        refetchPermissions();
      },
      onError: (error) => {
        toastError(error as any);
      }
    });

  const permissionsByView = useMemo(() => {
    const map = new Map<string, PermissionBuckets>();

    const viewsByNamespacedRef = new Map<string, View>();
    const viewsByName = new Map<string, View[]>();

    for (const view of views) {
      viewsByNamespacedRef.set(`${view.namespace || ""}/${view.name}`, view);

      const existingViews = viewsByName.get(view.name) ?? [];
      existingViews.push(view);
      viewsByName.set(view.name, existingViews);
    }

    for (const permission of viewPermissions) {
      if (permission.deny === true) {
        continue;
      }

      if (
        permission.subject_type === EVERYONE_SUBJECT_TYPE &&
        permission.subject === EVERYONE_SUBJECT_ID
      ) {
        continue;
      }

      const viewRefs = permission.object_selector?.views ?? [];
      if (viewRefs.length === 0) {
        continue;
      }

      for (const viewRef of viewRefs) {
        const matchedView = viewRef.namespace
          ? viewsByNamespacedRef.get(`${viewRef.namespace}/${viewRef.name}`)
          : viewsByName.get(viewRef.name)?.[0];

        if (!matchedView) {
          continue;
        }

        const current = map.get(matchedView.id) ?? { users: [], groups: [] };

        if (permission.subject_type === "person") {
          current.users.push(permission);
        } else if (
          permission.subject_type === "team" ||
          permission.subject_type === "group"
        ) {
          current.groups.push(permission);
        }

        map.set(matchedView.id, current);
      }
    }

    return map;
  }, [viewPermissions, views]);

  const globalOverrideByView = useMemo(() => {
    const map = new Map<string, "allow" | "none" | "deny">();

    for (const permission of viewPermissions) {
      if (
        permission.action !== "mcp:run" ||
        permission.subject_type !== EVERYONE_SUBJECT_TYPE ||
        permission.subject !== EVERYONE_SUBJECT_ID
      ) {
        continue;
      }

      const viewRefs = permission.object_selector?.views ?? [];
      for (const viewRef of viewRefs) {
        const view = views.find(
          (v) =>
            v.name === viewRef.name &&
            (viewRef.namespace ? v.namespace === viewRef.namespace : true)
        );

        if (view) {
          map.set(view.id, permission.deny === true ? "deny" : "allow");
        }
      }
    }

    return map;
  }, [viewPermissions, views]);

  const selectedView = useMemo(() => {
    return views.find((view) => view.id === selectedViewId);
  }, [selectedViewId, views]);

  const loading =
    isViewsLoading ||
    isPermissionsLoading ||
    isViewsRefetching ||
    isPermissionsRefetching ||
    isUpdatingGlobalOverride ||
    isAllowingSelective;

  return (
    <McpTabsLinks
      activeTab="Views"
      loading={loading}
      onRefresh={() => {
        refetchViews();
        refetchPermissions();
      }}
    >
      <div className="flex h-full w-full flex-1 flex-col gap-4 p-6 pb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            View permissions
          </h3>
          <p className="text-sm text-gray-600">
            Control which views MCP clients can invoke through this gateway.
          </p>
        </div>

        <div className="grid min-h-0 flex-1 content-start gap-3 overflow-y-auto [grid-template-columns:repeat(auto-fit,minmax(460px,1fr))]">
          {views.map((view) => {
            const permissions = permissionsByView.get(view.id) ?? {
              users: [],
              groups: []
            };

            return (
              <PermissionAccessCard
                key={view.id}
                entity={{
                  id: view.id,
                  name: view.spec?.title || view.name,
                  namespace: view.namespace,
                  icon: view.spec?.icon || "workflow"
                }}
                users={permissions.users}
                groups={permissions.groups}
                subjectLookup={subjectLookup}
                globalOverride={globalOverrideByView.get(view.id) ?? "none"}
                isMutating={mutatingViewId === view.id}
                onGlobalOverrideChange={(override) => {
                  setMutatingViewId(view.id);
                  setGlobalOverride(
                    { view, override },
                    {
                      onSettled: () => {
                        setMutatingViewId((current) =>
                          current === view.id ? null : current
                        );
                      }
                    }
                  );
                }}
                onAllowSelective={() => setSelectedViewId(view.id)}
              />
            );
          })}
        </div>
      </div>

      <SubjectSelectorModal
        open={!!selectedView}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedViewId(null);
          }
        }}
        title={`Allow access: ${selectedView?.spec?.title || selectedView?.name || ""}`}
        description="Select users or groups to allow this view for MCP usage."
        preselectedSubjectIds={
          selectedView
            ? viewPermissions
                .filter(
                  (permission) =>
                    permission.deny !== true &&
                    permission.subject &&
                    (permission.subject_type === "person" ||
                      permission.subject_type === "team" ||
                      permission.subject_type === "group") &&
                    permissionMatchesView(permission, selectedView)
                )
                .map((permission) => permission.subject!)
            : []
        }
        isSubmitting={isAllowingSelective}
        onAllow={async (subjects) => {
          if (!selectedView) {
            return;
          }

          await allowSelectiveAccess({
            view: selectedView,
            subjects
          });
        }}
      />
    </McpTabsLinks>
  );
}
