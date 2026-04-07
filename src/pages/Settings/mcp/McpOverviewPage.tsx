import {
  addPermission,
  deletePermission,
  fetchAllPermissionSubjects,
  fetchMcpUserPermissions,
  MCP_SETTINGS_PERMISSION_SOURCE,
  PermissionSubject,
  updatePermission
} from "@flanksource-ui/api/services/permissions";
import { PermissionsSummary } from "@flanksource-ui/api/types/permissions";
import UserAccessCard from "@flanksource-ui/components/Permissions/UserAccessCard";
import McpTabsLinks from "@flanksource-ui/components/MCP/McpTabsLinks";
import { toastError } from "@flanksource-ui/components/Toast/toast";
import { useUser } from "@flanksource-ui/context";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

const MCP_OBJECT = "mcp";
const MCP_ACTION = "mcp:use";

const TYPE_LABELS: Record<PermissionSubject["type"], string> = {
  person: "person",
  team: "team",
  role: "role",
  permission_subject_group: "group"
};

const SUBJECT_TYPE_ORDER: Record<PermissionSubject["type"], number> = {
  role: 0,
  permission_subject_group: 1,
  team: 2,
  person: 3
};

function isMcpUserAccessPermission(permission: PermissionsSummary) {
  return (
    permission.action === MCP_ACTION &&
    permission.object === MCP_OBJECT &&
    !!permission.subject &&
    !!permission.id &&
    permission.source === MCP_SETTINGS_PERMISSION_SOURCE
  );
}

function mapPermissionSubjectType(type: PermissionSubject["type"]) {
  if (type === "permission_subject_group" || type === "role") {
    return "group" as const;
  }

  return type;
}

export default function McpOverviewPage() {
  const { user } = useUser();
  const [mutatingSubjectId, setMutatingSubjectId] = useState<string | null>(
    null
  );

  const {
    data: subjects = [],
    isLoading: isUsersLoading,
    refetch: refetchUsers,
    isRefetching: isUsersRefetching
  } = useQuery({
    queryKey: ["mcp", "permission-subjects", "all"],
    queryFn: fetchAllPermissionSubjects
  });

  const {
    data: userPermissions = [],
    isLoading: isPermissionsLoading,
    refetch: refetchPermissions,
    isRefetching: isPermissionsRefetching
  } = useQuery({
    queryKey: ["mcp", "users", "permissions"],
    queryFn: fetchMcpUserPermissions
  });

  const permissionsByUser = useMemo(() => {
    const map = new Map<string, PermissionsSummary[]>();

    for (const permission of userPermissions) {
      if (!isMcpUserAccessPermission(permission)) {
        continue;
      }

      const subjectId = permission.subject!;
      const current = map.get(subjectId) ?? [];
      current.push(permission);
      map.set(subjectId, current);
    }

    return map;
  }, [userPermissions]);

  const groupedSubjects = useMemo(() => {
    const seen = new Set<string>();
    const grouped = new Map<PermissionSubject["type"], PermissionSubject[]>();

    for (const subject of subjects) {
      if (seen.has(subject.id)) {
        continue;
      }
      seen.add(subject.id);

      const list = grouped.get(subject.type) ?? [];
      list.push(subject);
      grouped.set(subject.type, list);
    }

    return Array.from(grouped.entries())
      .sort((a, b) => SUBJECT_TYPE_ORDER[a[0]] - SUBJECT_TYPE_ORDER[b[0]])
      .map(([type, groupedItems]) => ({
        type,
        subjects: groupedItems.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
        )
      }));
  }, [subjects]);

  const { mutate: setUserAccess, isLoading: isUpdatingUserAccess } =
    useMutation({
      mutationFn: async ({
        subjectId,
        subjectType,
        access
      }: {
        subjectId: string;
        subjectType: PermissionSubject["type"];
        access: "deny" | "default" | "allow";
      }) => {
        // Re-fetch to avoid acting on stale data from the render closure
        const latestPermissions = await fetchMcpUserPermissions();
        const existingPermissions = latestPermissions
          .filter(isMcpUserAccessPermission)
          .filter(
            (permission) =>
              permission.subject === subjectId &&
              permission.source === MCP_SETTINGS_PERMISSION_SOURCE
          );

        if (access === "default") {
          await Promise.all(
            existingPermissions.map((permission) =>
              deletePermission(permission.id!)
            )
          );
          return;
        }

        const targetDeny = access === "deny";
        const primaryPermission = existingPermissions[0];
        const duplicatePermissionIds = existingPermissions
          .slice(1)
          .map((permission) => permission.id!);

        if (!primaryPermission) {
          await addPermission({
            object: MCP_OBJECT,
            action: MCP_ACTION,
            subject: subjectId,
            subject_type: mapPermissionSubjectType(subjectType),
            deny: targetDeny,
            source: MCP_SETTINGS_PERMISSION_SOURCE,
            created_by: user?.id!
          } as any);

          return;
        }

        await Promise.all([
          ...(primaryPermission.deny !== targetDeny
            ? [
                updatePermission({
                  id: primaryPermission.id,
                  deny: targetDeny
                } as any)
              ]
            : []),
          ...duplicatePermissionIds.map((id) => deletePermission(id))
        ]);
      },
      onSuccess: () => {
        refetchPermissions();
      },
      onError: (error) => {
        toastError(error as any);
      }
    });

  const loading =
    isUsersLoading ||
    isPermissionsLoading ||
    isUsersRefetching ||
    isPermissionsRefetching ||
    isUpdatingUserAccess;

  const isInitialLoading =
    (isUsersLoading || isPermissionsLoading) && subjects.length === 0;

  return (
    <McpTabsLinks
      activeTab="Overview"
      loading={loading}
      isInitialLoading={isInitialLoading}
      loadingText="Loading MCP subjects..."
      onRefresh={() => {
        refetchUsers();
        refetchPermissions();
      }}
    >
      <div className="flex h-full w-full flex-1 flex-col gap-4 p-6 pb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Subject permissions
          </h3>
          <p className="text-sm text-gray-600">
            Control which users, teams, groups, or roles can use MCP through
            this gateway.
          </p>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto rounded-md border p-2">
          {groupedSubjects.map((group) => (
            <div key={group.type} className="space-y-1">
              <div className="pt-2 text-xs font-semibold uppercase tracking-wide text-gray-500 first:pt-0">
                {TYPE_LABELS[group.type] ?? group.type}
              </div>

              <div className="[&>*+*]:border-t [&>*+*]:border-gray-200 [&>*+*]:pt-2 [&>*]:pb-2">
                {group.subjects.map((subject) => {
                  const permissions = permissionsByUser.get(subject.id) ?? [];

                  const activePermission = permissions.find(
                    (permission) =>
                      permission.source === MCP_SETTINGS_PERMISSION_SOURCE
                  );

                  const access = !activePermission
                    ? "default"
                    : activePermission.deny === true
                      ? "deny"
                      : "allow";

                  return (
                    <UserAccessCard
                      key={subject.id}
                      user={{
                        id: subject.id,
                        name: subject.name,
                        type: subject.type
                      }}
                      action={MCP_ACTION}
                      object={MCP_OBJECT}
                      access={access}
                      isMutating={mutatingSubjectId === subject.id}
                      onChangeAccess={(access) => {
                        setMutatingSubjectId(subject.id);
                        setUserAccess(
                          {
                            subjectId: subject.id,
                            subjectType: subject.type,
                            access
                          },
                          {
                            onSettled: () => {
                              setMutatingSubjectId((current) =>
                                current === subject.id ? null : current
                              );
                            }
                          }
                        );
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </McpTabsLinks>
  );
}
