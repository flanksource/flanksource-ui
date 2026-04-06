import { getAllPlaybookNames } from "@flanksource-ui/api/services/playbooks";
import {
  addPermission,
  deletePermission,
  fetchMcpPlaybookPermissions,
  updatePermission,
  fetchPermissionSubjects,
  PermissionSubject
} from "@flanksource-ui/api/services/permissions";
import { PermissionsSummary } from "@flanksource-ui/api/types/permissions";
import PermissionAccessCard from "@flanksource-ui/components/Permissions/PermissionAccessCard";
import SubjectSelectorModal from "@flanksource-ui/components/Permissions/SubjectSelectorModal";
import McpTabsLinks from "@flanksource-ui/components/MCP/McpTabsLinks";
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

export default function McpPlaybooksPage() {
  const { user } = useUser();
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<string | null>(
    null
  );
  const [mutatingPlaybookId, setMutatingPlaybookId] = useState<string | null>(
    null
  );

  const {
    data: playbooks = [],
    isLoading: isPlaybooksLoading,
    refetch: refetchPlaybooks,
    isRefetching: isPlaybooksRefetching
  } = useQuery({
    queryKey: ["mcp", "playbooks", "all"],
    queryFn: getAllPlaybookNames
  });

  const {
    data: playbookPermissions = [],
    isLoading: isPermissionsLoading,
    refetch: refetchPermissions,
    isRefetching: isPermissionsRefetching
  } = useQuery({
    queryKey: ["mcp", "playbooks", "permissions"],
    queryFn: fetchMcpPlaybookPermissions
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
        playbookId,
        override
      }: {
        playbookId: string;
        override: "allow" | "none" | "deny";
      }) => {
        const existingOverrides = playbookPermissions.filter(
          (permission) =>
            permission.playbook_id === playbookId &&
            permission.action === "mcp:run" &&
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
          playbook_id: playbookId,
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
        playbookId,
        subjects
      }: {
        playbookId: string;
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

        const existingPermissions = playbookPermissions.filter(
          (permission) =>
            permission.playbook_id === playbookId &&
            permission.action === "mcp:run" &&
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
              playbook_id: playbookId,
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

        setSelectedPlaybookId(null);
        refetchPermissions();
      },
      onError: (error) => {
        toastError(error as any);
      }
    });

  const permissionsByPlaybook = useMemo(() => {
    const map = new Map<string, PermissionBuckets>();

    for (const permission of playbookPermissions) {
      if (!permission.playbook_id || permission.deny === true) {
        continue;
      }

      if (
        permission.subject_type === EVERYONE_SUBJECT_TYPE &&
        permission.subject === EVERYONE_SUBJECT_ID
      ) {
        continue;
      }

      const current = map.get(permission.playbook_id) ?? {
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

      map.set(permission.playbook_id, current);
    }

    return map;
  }, [playbookPermissions]);

  const globalOverrideByPlaybook = useMemo(() => {
    const map = new Map<string, "allow" | "none" | "deny">();

    for (const permission of playbookPermissions) {
      if (
        !permission.playbook_id ||
        permission.action !== "mcp:run" ||
        permission.subject_type !== EVERYONE_SUBJECT_TYPE ||
        permission.subject !== EVERYONE_SUBJECT_ID
      ) {
        continue;
      }

      map.set(
        permission.playbook_id,
        permission.deny === true ? "deny" : "allow"
      );
    }

    return map;
  }, [playbookPermissions]);

  const selectedPlaybook = useMemo(() => {
    return playbooks.find((playbook) => playbook.id === selectedPlaybookId);
  }, [playbooks, selectedPlaybookId]);

  const loading =
    isPlaybooksLoading ||
    isPermissionsLoading ||
    isPlaybooksRefetching ||
    isPermissionsRefetching ||
    isUpdatingGlobalOverride ||
    isAllowingSelective;

  return (
    <McpTabsLinks
      activeTab="Playbooks"
      loading={loading}
      onRefresh={() => {
        refetchPlaybooks();
        refetchPermissions();
      }}
    >
      <div className="flex h-full w-full flex-1 flex-col gap-4 p-6 pb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Playbook permissions
          </h3>
          <p className="text-sm text-gray-600">
            Control which playbooks MCP clients can invoke through this gateway.
          </p>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 content-start gap-3 overflow-y-auto">
          {playbooks.map((playbook) => {
            const permissions = permissionsByPlaybook.get(playbook.id) ?? {
              users: [],
              groups: []
            };

            return (
              <PermissionAccessCard
                key={playbook.id}
                entity={{
                  id: playbook.id,
                  name: playbook.title || playbook.name,
                  namespace: playbook.namespace,
                  icon: playbook.icon
                }}
                users={permissions.users}
                groups={permissions.groups}
                subjectLookup={subjectLookup}
                globalOverride={
                  globalOverrideByPlaybook.get(playbook.id) ?? "none"
                }
                isMutating={mutatingPlaybookId === playbook.id}
                onGlobalOverrideChange={(override) => {
                  setMutatingPlaybookId(playbook.id);
                  setGlobalOverride(
                    { playbookId: playbook.id, override },
                    {
                      onSettled: () => {
                        setMutatingPlaybookId((current) =>
                          current === playbook.id ? null : current
                        );
                      }
                    }
                  );
                }}
                onAllowSelective={() => setSelectedPlaybookId(playbook.id)}
              />
            );
          })}
        </div>
      </div>

      <SubjectSelectorModal
        open={!!selectedPlaybook}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPlaybookId(null);
          }
        }}
        title={`Allow access: ${selectedPlaybook?.title || selectedPlaybook?.name || ""}`}
        description="Select users or groups to allow this playbook for MCP usage."
        preselectedSubjectIds={
          selectedPlaybook
            ? playbookPermissions
                .filter(
                  (permission) =>
                    permission.playbook_id === selectedPlaybook.id &&
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
          if (!selectedPlaybook) {
            return;
          }

          await allowSelectiveAccess({
            playbookId: selectedPlaybook.id,
            subjects
          });
        }}
      />
    </McpTabsLinks>
  );
}
