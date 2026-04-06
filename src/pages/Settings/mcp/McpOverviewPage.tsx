import {
  addPermission,
  deletePermission,
  fetchAllPermissionSubjects,
  fetchMcpUserPermissions,
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

function isMcpUserAccessPermission(permission: PermissionsSummary) {
  return (
    permission.action === MCP_ACTION &&
    permission.object === MCP_OBJECT &&
    !!permission.subject &&
    !!permission.id &&
    (permission.source === "mcp_settings" || permission.source === "UI")
  );
}

function mapPermissionSubjectType(type: PermissionSubject["type"]) {
  if (type === "permission_subject_group") {
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
        const existingPermissions = (
          permissionsByUser.get(subjectId) ?? []
        ).filter((permission) => permission.source === "mcp_settings");

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
            source: "mcp_settings",
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

  return (
    <McpTabsLinks
      activeTab="Overview"
      loading={loading}
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

        <div className="grid min-h-0 flex-1 content-start gap-3 overflow-y-auto [grid-template-columns:repeat(auto-fit,minmax(420px,1fr))]">
          {subjects.map((subject) => {
            const permissions = permissionsByUser.get(subject.id) ?? [];

            const activePermission =
              permissions.find(
                (permission) => permission.source === "mcp_settings"
              ) ?? permissions[0];

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
    </McpTabsLinks>
  );
}
