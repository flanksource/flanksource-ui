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
import { PlaybookNames } from "@flanksource-ui/api/types/playbooks";
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
const EVERYONE_SUBJECT_TYPE = "group";

function permissionMatchesPlaybook(
  permission: PermissionsSummary,
  playbook: PlaybookNames
) {
  const playbookRefs = permission.object_selector?.playbooks ?? [];

  return playbookRefs.some((playbookRef) => {
    if (!playbookRef?.name) {
      return false;
    }

    if (playbookRef.namespace) {
      return (
        playbookRef.namespace === playbook.namespace &&
        playbookRef.name === playbook.name
      );
    }

    return playbookRef.name === playbook.name;
  });
}

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
        playbook,
        override
      }: {
        playbook: PlaybookNames;
        override: "allow" | "none" | "deny";
      }) => {
        const latestPermissions = await fetchMcpPlaybookPermissions();

        const matchingOverrides = latestPermissions.filter(
          (permission) =>
            permission.action === "mcp:run" &&
            permission.subject_type === EVERYONE_SUBJECT_TYPE &&
            permission.subject === EVERYONE_SUBJECT_ID &&
            permission.id &&
            permission.source === "mcp_settings" &&
            permissionMatchesPlaybook(permission, playbook)
        );

        if (override === "none") {
          await Promise.all(
            matchingOverrides.map((permission) =>
              deletePermission(permission.id)
            )
          );
          return;
        }

        const targetDeny = override === "deny";
        const [canonicalOverride, ...duplicateOverrides] = matchingOverrides;

        if (duplicateOverrides.length > 0) {
          await Promise.all(
            duplicateOverrides.map((permission) =>
              deletePermission(permission.id)
            )
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
            playbooks: [{ name: playbook.name, namespace: playbook.namespace }]
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
        playbook,
        subjects
      }: {
        playbook: PlaybookNames;
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
            permission.action === "mcp:run" &&
            permission.deny !== true &&
            permission.subject &&
            permission.id &&
            (permission.subject_type === "person" ||
              permission.subject_type === "team" ||
              permission.subject_type === "group") &&
            (permission.source === "mcp_settings" ||
              permission.source === "UI") &&
            permissionMatchesPlaybook(permission, playbook)
        );

        const existingKeys = new Set(
          existingPermissions.map(
            (permission) => `${permission.subject_type}:${permission.subject}`
          )
        );

        const playbookSelector = [
          { name: playbook.name, namespace: playbook.namespace }
        ];

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
              object_selector: { playbooks: playbookSelector },
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

    const playbooksByNamespacedRef = new Map<string, PlaybookNames>();
    const playbooksByName = new Map<string, PlaybookNames[]>();

    for (const playbook of playbooks) {
      playbooksByNamespacedRef.set(
        `${playbook.namespace || ""}/${playbook.name}`,
        playbook
      );

      const existingPlaybooks = playbooksByName.get(playbook.name) ?? [];
      existingPlaybooks.push(playbook);
      playbooksByName.set(playbook.name, existingPlaybooks);
    }

    for (const permission of playbookPermissions) {
      if (permission.deny === true) {
        continue;
      }

      if (
        permission.subject_type === EVERYONE_SUBJECT_TYPE &&
        permission.subject === EVERYONE_SUBJECT_ID
      ) {
        continue;
      }

      const playbookRefs = permission.object_selector?.playbooks ?? [];
      if (playbookRefs.length === 0) {
        continue;
      }

      for (const playbookRef of playbookRefs) {
        if (!playbookRef.name) {
          continue;
        }

        const matchedPlaybook = playbookRef.namespace
          ? playbooksByNamespacedRef.get(
              `${playbookRef.namespace}/${playbookRef.name}`
            )
          : playbooksByName.get(playbookRef.name)?.[0];

        if (!matchedPlaybook) {
          continue;
        }

        const current = map.get(matchedPlaybook.id) ?? {
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

        map.set(matchedPlaybook.id, current);
      }
    }

    return map;
  }, [playbookPermissions, playbooks]);

  const globalOverrideByPlaybook = useMemo(() => {
    const map = new Map<string, "allow" | "none" | "deny">();

    for (const permission of playbookPermissions) {
      if (
        permission.action !== "mcp:run" ||
        permission.subject_type !== EVERYONE_SUBJECT_TYPE ||
        permission.subject !== EVERYONE_SUBJECT_ID
      ) {
        continue;
      }

      const playbookRefs = permission.object_selector?.playbooks ?? [];

      for (const playbookRef of playbookRefs) {
        if (!playbookRef.name) {
          continue;
        }

        const playbook = playbooks.find(
          (p) =>
            p.name === playbookRef.name &&
            (playbookRef.namespace
              ? p.namespace === playbookRef.namespace
              : true)
        );

        if (playbook) {
          map.set(playbook.id, permission.deny === true ? "deny" : "allow");
        }
      }
    }

    return map;
  }, [playbookPermissions, playbooks]);

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
                    { playbook, override },
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
                    permission.deny !== true &&
                    permission.subject &&
                    (permission.subject_type === "person" ||
                      permission.subject_type === "team" ||
                      permission.subject_type === "group") &&
                    permissionMatchesPlaybook(permission, selectedPlaybook)
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
            playbook: selectedPlaybook,
            subjects
          });
        }}
      />
    </McpTabsLinks>
  );
}
