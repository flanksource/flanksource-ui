import { getPersons } from "@flanksource-ui/api/services/users";
import {
  addPermission,
  deletePermission,
  fetchMcpUserPermissions,
  fetchPermissionSubjects,
  PermissionSubject,
  updatePermission
} from "@flanksource-ui/api/services/permissions";
import { PermissionsSummary } from "@flanksource-ui/api/types/permissions";
import PermissionAccessCard from "@flanksource-ui/components/Permissions/PermissionAccessCard";
import McpTabsLinks from "@flanksource-ui/components/MCP/McpTabsLinks";
import SubjectSelectorModal from "@flanksource-ui/components/Permissions/SubjectSelectorModal";
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

export default function McpOverviewPage() {
  const { user } = useUser();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [mutatingUserId, setMutatingUserId] = useState<string | null>(null);

  const {
    data: usersResponse,
    isLoading: isUsersLoading,
    refetch: refetchUsers,
    isRefetching: isUsersRefetching
  } = useQuery({
    queryKey: ["mcp", "users", "all"],
    queryFn: getPersons
  });

  const users = usersResponse?.data ?? [];

  const {
    data: userPermissions = [],
    isLoading: isPermissionsLoading,
    refetch: refetchPermissions,
    isRefetching: isPermissionsRefetching
  } = useQuery({
    queryKey: ["mcp", "users", "permissions"],
    queryFn: fetchMcpUserPermissions
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
        personId,
        override
      }: {
        personId: string;
        override: "allow" | "none" | "deny";
      }) => {
        const existingOverrides = userPermissions.filter(
          (permission) =>
            permission.person_id === personId &&
            permission.action === "mcp:use" &&
            permission.subject_type === EVERYONE_SUBJECT_TYPE &&
            permission.subject === EVERYONE_SUBJECT_ID &&
            permission.id &&
            permission.source === "mcp_settings"
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
          person_id: personId,
          object: "mcp",
          action: "mcp:use",
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
        personId,
        subjects
      }: {
        personId: string;
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

        const existingPermissions = userPermissions.filter(
          (permission) =>
            permission.person_id === personId &&
            permission.action === "mcp:use" &&
            permission.deny !== true &&
            permission.subject &&
            permission.id &&
            (permission.subject_type === "person" ||
              permission.subject_type === "team" ||
              permission.subject_type === "group") &&
            (permission.source === "mcp_settings" || permission.source === "UI")
        );

        const existingKeys = new Set(
          existingPermissions.map(
            (permission) => `${permission.subject_type}:${permission.subject}`
          )
        );

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
              person_id: personId,
              object: "mcp" as const,
              action: "mcp:use",
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

        setSelectedUserId(null);
        refetchPermissions();
      },
      onError: (error) => {
        toastError(error as any);
      }
    });

  const permissionsByUser = useMemo(() => {
    const map = new Map<string, PermissionBuckets>();

    for (const permission of userPermissions) {
      if (!permission.person_id || permission.deny === true) {
        continue;
      }

      if (
        permission.subject_type === EVERYONE_SUBJECT_TYPE &&
        permission.subject === EVERYONE_SUBJECT_ID
      ) {
        continue;
      }

      const current = map.get(permission.person_id) ?? {
        users: [],
        groups: []
      };

      if (permission.subject_type === "person") {
        current.users.push(permission);
      } else if (
        permission.subject_type === "team" ||
        permission.subject_type === "group"
      ) {
        current.groups.push(permission);
      }

      map.set(permission.person_id, current);
    }

    return map;
  }, [userPermissions]);

  const globalOverrideByUser = useMemo(() => {
    const map = new Map<string, "allow" | "none" | "deny">();

    for (const permission of userPermissions) {
      if (
        !permission.person_id ||
        permission.action !== "mcp:use" ||
        permission.subject_type !== EVERYONE_SUBJECT_TYPE ||
        permission.subject !== EVERYONE_SUBJECT_ID
      ) {
        continue;
      }

      map.set(
        permission.person_id,
        permission.deny === true ? "deny" : "allow"
      );
    }

    return map;
  }, [userPermissions]);

  const selectedUser = useMemo(() => {
    return users.find((item) => item.id === selectedUserId);
  }, [selectedUserId, users]);

  const loading =
    isUsersLoading ||
    isPermissionsLoading ||
    isUsersRefetching ||
    isPermissionsRefetching ||
    isUpdatingGlobalOverride ||
    isAllowingSelective;

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
            User permissions
          </h3>
          <p className="text-sm text-gray-600">
            Control which users can be used by MCP clients through this gateway.
          </p>
        </div>

        <div className="grid min-h-0 flex-1 content-start gap-3 overflow-y-auto [grid-template-columns:repeat(auto-fit,minmax(460px,1fr))]">
          {users.map((person) => {
            const permissions = permissionsByUser.get(person.id) ?? {
              users: [],
              groups: []
            };

            return (
              <PermissionAccessCard
                key={person.id}
                entity={{
                  id: person.id,
                  name: person.name,
                  namespace: person.email,
                  icon: "user"
                }}
                users={permissions.users}
                groups={permissions.groups}
                subjectLookup={subjectLookup}
                globalOverride={globalOverrideByUser.get(person.id) ?? "none"}
                isMutating={mutatingUserId === person.id}
                onGlobalOverrideChange={(override) => {
                  setMutatingUserId(person.id);
                  setGlobalOverride(
                    { personId: person.id, override },
                    {
                      onSettled: () => {
                        setMutatingUserId((current) =>
                          current === person.id ? null : current
                        );
                      }
                    }
                  );
                }}
                onAllowSelective={() => setSelectedUserId(person.id)}
              />
            );
          })}
        </div>
      </div>

      <SubjectSelectorModal
        open={!!selectedUser}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedUserId(null);
          }
        }}
        title={`Allow access: ${selectedUser?.name || ""}`}
        description="Select users or groups to allow this user for MCP usage."
        preselectedSubjectIds={
          selectedUser
            ? userPermissions
                .filter(
                  (permission) =>
                    permission.person_id === selectedUser.id &&
                    permission.deny !== true &&
                    permission.subject &&
                    (permission.subject_type === "person" ||
                      permission.subject_type === "team" ||
                      permission.subject_type === "group")
                )
                .map((permission) => permission.subject!)
            : []
        }
        isSubmitting={isAllowingSelective}
        onAllow={async (subjects) => {
          if (!selectedUser) {
            return;
          }

          await allowSelectiveAccess({
            personId: selectedUser.id,
            subjects
          });
        }}
      />
    </McpTabsLinks>
  );
}
