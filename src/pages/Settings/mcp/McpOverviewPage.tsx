import {
  addPermission,
  deletePermission,
  fetchAllPermissionSubjects,
  fetchMcpUserPermissions,
  INTERACTIVE_SETTINGS_PERMISSION_SOURCE,
  isSettingsManagedPermissionSource,
  PermissionSubject,
  updatePermission
} from "@flanksource-ui/api/services/permissions";
import { useTokensListQuery } from "@flanksource-ui/api/query-hooks/useTokensQuery";
import { PermissionsSummary } from "@flanksource-ui/api/types/permissions";
import McpTabsLinks from "@flanksource-ui/components/MCP/McpTabsLinks";
import UserList from "@flanksource-ui/components/MCP/UserList";
import TokensTable from "@flanksource-ui/components/Tokens/List/TokensTable";
import { toastError } from "@flanksource-ui/components/Toast/toast";
import SetupMcpModal from "@flanksource-ui/components/Users/SetupMcpModal";
import { useUser } from "@flanksource-ui/context";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";

const MCP_OBJECT = "mcp";
const MCP_ACTION = "mcp:use";

const SUBJECT_TYPE_ORDER: Record<PermissionSubject["type"], number> = {
  role: 0,
  permission_subject_group: 1,
  team: 2,
  person: 3,
  access_token_person: 4
};

function isMcpUserAccessPermission(permission: PermissionsSummary) {
  return (
    permission.action === MCP_ACTION &&
    permission.object === MCP_OBJECT &&
    !!permission.subject &&
    !!permission.id &&
    isSettingsManagedPermissionSource(permission.source)
  );
}

function mapPermissionSubjectType(type: PermissionSubject["type"]) {
  if (type === "permission_subject_group" || type === "role") {
    return "group" as const;
  }

  if (type === "access_token_person") {
    return "person" as const;
  }

  return type;
}

export default function McpOverviewPage() {
  const { user } = useUser();
  const [mutatingSubjectId, setMutatingSubjectId] = useState<string | null>(
    null
  );
  const [isSetupMcpModalOpen, setIsSetupMcpModalOpen] = useState(false);

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
      if (subject.type === "access_token_person") {
        continue;
      }

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
              isSettingsManagedPermissionSource(permission.source)
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
          if (!user?.id) {
            throw new Error("User must be logged in to create permissions");
          }

          await addPermission({
            object: MCP_OBJECT,
            action: MCP_ACTION,
            subject: subjectId,
            subject_type: mapPermissionSubjectType(subjectType),
            deny: targetDeny,
            source: INTERACTIVE_SETTINGS_PERMISSION_SOURCE,
            created_by: user.id
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
      onSettled: () => {
        refetchPermissions();
      },
      onError: (error) => {
        toastError(error as any);
      }
    });

  const {
    data: tokens = [],
    isLoading: isTokensLoading,
    refetch: refetchTokens,
    isRefetching: isTokensRefetching
  } = useTokensListQuery({
    keepPreviousData: true,
    staleTime: 0,
    cacheTime: 0
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
      headerAction={
        <button
          key="setup-mcp"
          type="button"
          aria-label="Setup MCP"
          title="Setup MCP"
          onClick={() => setIsSetupMcpModalOpen(true)}
        >
          <AiFillPlusCircle size={24} className="text-blue-600" />
        </button>
      }
      onRefresh={() => {
        refetchUsers();
        refetchPermissions();
        refetchTokens();
      }}
    >
      <UserList
        groupedSubjects={groupedSubjects}
        permissionsByUser={permissionsByUser}
        mutatingSubjectId={mutatingSubjectId}
        onChangeAccess={(subject, access) => {
          setMutatingSubjectId(subject.id);
          setUserAccess(
            { subjectId: subject.id, subjectType: subject.type, access },
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

      <div className="px-6">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          MCP access tokens
        </div>
        <TokensTable
          tokens={tokens}
          isLoading={isTokensLoading}
          isRefetching={isTokensRefetching}
          refresh={refetchTokens}
          showHideAgentsToggle={false}
          defaultHideAgents={true}
          tokenIdSearchParamKey="mcpTokenId"
        />
      </div>

      <SetupMcpModal
        isOpen={isSetupMcpModalOpen}
        onClose={() => setIsSetupMcpModalOpen(false)}
      />
    </McpTabsLinks>
  );
}
