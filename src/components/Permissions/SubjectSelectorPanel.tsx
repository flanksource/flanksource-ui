import {
  fetchAllPermissionSubjects,
  PermissionSubject
} from "@flanksource-ui/api/services/permissions";
import {
  fetchEffectiveResourceSubjectAccess,
  SubjectAccessReviewAction
} from "@flanksource-ui/api/services/rbac";
import SubjectAvatar from "@flanksource-ui/components/Permissions/SubjectAvatar";
import TriStateAccessSwitch from "@flanksource-ui/components/Permissions/TriStateAccessSwitch";
import { Button } from "@flanksource-ui/components/ui/button";
import { Input } from "@flanksource-ui/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@flanksource-ui/components/ui/tooltip";
import useDebouncedValue from "@flanksource-ui/hooks/useDebounce";
import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { useQuery } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const TYPE_LABELS: Record<PermissionSubject["type"], string> = {
  person: "person",
  access_token_person: "access token",
  team: "team",
  role: "role",
  permission_subject_group: "group"
};

const SUBJECT_TYPE_ORDER: Record<PermissionSubject["type"], number> = {
  role: 0,
  permission_subject_group: 1,
  team: 2,
  person: 3,
  access_token_person: 4
};

export type SubjectAccess = "deny" | "default" | "allow";

const BULK_OPTIONS = ["Deny All", "Custom", "Allow all"] as const;
type BulkOption = (typeof BULK_OPTIONS)[number];

type SubjectSelectorPanelProps = {
  title?: string;
  description?: string;
  headerEntity?: {
    name: string;
    icon?: string;
  };
  effectiveAccessResource?: {
    id: string;
    type: "playbook" | "view";
    action?: SubjectAccessReviewAction;
  };
  preselectedSubjectAccess?: Record<string, "allow" | "deny">;
  isSubmitting?: boolean;
  isBulkSubmitting?: boolean;
  mutatingSubjectId?: string | null;
  bulkAccess?: SubjectAccess;
  onSetBulkAccess?: (access: SubjectAccess) => Promise<void> | void;
  onSetSubjectAccess: (
    subject: PermissionSubject,
    access: SubjectAccess
  ) => Promise<void> | void;
  onSetManySubjectAccess?: (
    selections: Array<{ subject: PermissionSubject; access: "allow" | "deny" }>
  ) => Promise<void> | void;
};

export default function SubjectSelectorPanel({
  title,
  description,
  effectiveAccessResource,
  preselectedSubjectAccess = {},
  isSubmitting = false,
  isBulkSubmitting = false,
  mutatingSubjectId,
  headerEntity,
  bulkAccess,
  onSetBulkAccess,
  onSetSubjectAccess,
  onSetManySubjectAccess
}: SubjectSelectorPanelProps) {
  const [search, setSearch] = useState("");
  const [selectedAccessById, setSelectedAccessById] = useState<
    Record<string, SubjectAccess>
  >({});
  const [
    hasTriggeredEffectiveAccessCheck,
    setHasTriggeredEffectiveAccessCheck
  ] = useState(false);

  const debouncedSearch =
    useDebouncedValue(search, 250)?.trim().toLowerCase() ?? "";

  const {
    data: subjects = [],
    isLoading,
    isFetching
  } = useQuery({
    queryKey: ["mcp", "subject-selector", "all-subjects"],
    queryFn: fetchAllPermissionSubjects,
    staleTime: 60_000
  });

  const {
    data: effectiveSubjectAccessResponse,
    isFetching: isCheckingEffectiveAccess,
    refetch: refetchEffectiveSubjectAccess
  } = useQuery({
    queryKey: [
      "mcp",
      "subject-selector",
      "effective-access",
      effectiveAccessResource?.type ?? "none",
      effectiveAccessResource?.id ?? "none",
      subjects.length
    ],
    enabled: false,
    queryFn: async () => {
      if (!effectiveAccessResource) {
        return {
          resource: { id: "", type: "playbook" as const },
          action: "mcp:run" as const,
          results: [] as Array<{ subjectId: string; allowed: boolean }>
        };
      }

      return fetchEffectiveResourceSubjectAccess({
        resource: {
          id: effectiveAccessResource.id,
          type: effectiveAccessResource.type
        },
        action: effectiveAccessResource.action ?? "mcp:run",
        subjects: subjects.map((subject) => subject.id)
      });
    }
  });

  const normalizedPreselectedAccess = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(preselectedSubjectAccess)
          .filter(([, access]) => access === "allow" || access === "deny")
          .sort(([a], [b]) => a.localeCompare(b))
      ) as Record<string, "allow" | "deny">,
    [preselectedSubjectAccess]
  );

  const preselectedAccessSignature = useMemo(
    () => JSON.stringify(normalizedPreselectedAccess),
    [normalizedPreselectedAccess]
  );

  useEffect(() => {
    const parsed = preselectedAccessSignature
      ? (JSON.parse(preselectedAccessSignature) as Record<
          string,
          "allow" | "deny"
        >)
      : {};

    const next: Record<string, SubjectAccess> = {};
    for (const [id, access] of Object.entries(parsed)) {
      next[id] = access;
    }

    setSelectedAccessById(next);
  }, [preselectedAccessSignature]);

  useEffect(() => {
    setHasTriggeredEffectiveAccessCheck(false);
  }, [effectiveAccessResource?.type, effectiveAccessResource?.id]);

  const effectiveAccessBySubjectId = useMemo(() => {
    const map: Record<string, boolean> = {};

    for (const result of effectiveSubjectAccessResponse?.results ?? []) {
      map[result.subjectId] = result.allowed;
    }

    return map;
  }, [effectiveSubjectAccessResponse?.results]);

  const sortedSubjects = useMemo(() => {
    const query = debouncedSearch;

    return subjects
      .filter((subject) => {
        if (!query) {
          return true;
        }
        return subject.name.toLowerCase().includes(query);
      })
      .sort((a, b) => {
        const typeOrder =
          SUBJECT_TYPE_ORDER[a.type] - SUBJECT_TYPE_ORDER[b.type];
        if (typeOrder !== 0) {
          return typeOrder;
        }

        return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
      });
  }, [debouncedSearch, subjects]);

  const displayedSubjects = sortedSubjects;

  const groupedDisplayedSubjects = useMemo(() => {
    const grouped = new Map<PermissionSubject["type"], PermissionSubject[]>();

    for (const subject of displayedSubjects) {
      const list = grouped.get(subject.type) ?? [];
      list.push(subject);
      grouped.set(subject.type, list);
    }

    return Array.from(grouped.entries())
      .sort((a, b) => SUBJECT_TYPE_ORDER[a[0]] - SUBJECT_TYPE_ORDER[b[0]])
      .map(([type, groupSubjects]) => ({
        type,
        subjects: groupSubjects
      }));
  }, [displayedSubjects]);

  const bulkAccessFromSelection = useMemo<SubjectAccess>(() => {
    if (displayedSubjects.length === 0) {
      return "default";
    }

    const accessValues = displayedSubjects.map(
      (subject) => selectedAccessById[subject.id] ?? "default"
    );

    if (accessValues.every((value) => value === "allow")) {
      return "allow";
    }

    if (accessValues.every((value) => value === "deny")) {
      return "deny";
    }

    if (accessValues.every((value) => value === "default")) {
      return "default";
    }

    return "default";
  }, [displayedSubjects, selectedAccessById]);

  const resolvedBulkAccess = bulkAccess ?? bulkAccessFromSelection;

  const bulkOptionValue: BulkOption =
    resolvedBulkAccess === "allow"
      ? "Allow all"
      : resolvedBulkAccess === "deny"
        ? "Deny All"
        : "Custom";

  const setBulkSubjectAccess = async (access: SubjectAccess) => {
    if (onSetBulkAccess) {
      await onSetBulkAccess(access);
      return;
    }

    if (displayedSubjects.length === 0) {
      return;
    }

    const nextSelections = { ...selectedAccessById };

    for (const subject of displayedSubjects) {
      if (access === "default") {
        delete nextSelections[subject.id];
      } else {
        nextSelections[subject.id] = access;
      }
    }

    setSelectedAccessById(nextSelections);

    if (onSetManySubjectAccess) {
      const subjectsById = new Map(
        subjects.map((subject) => [subject.id, subject] as const)
      );

      const selections = Object.entries(nextSelections)
        .filter(([, value]) => value === "allow" || value === "deny")
        .map(([subjectId, value]) => {
          const subject = subjectsById.get(subjectId);
          if (!subject) {
            return null;
          }

          return {
            subject,
            access: value as "allow" | "deny"
          };
        })
        .filter(
          (
            entry
          ): entry is {
            subject: PermissionSubject;
            access: "allow" | "deny";
          } => !!entry
        );

      await onSetManySubjectAccess(selections);
      return;
    }

    await Promise.all(
      displayedSubjects.map((subject) => onSetSubjectAccess(subject, access))
    );
  };

  const setSubjectAccess = (
    subject: PermissionSubject,
    access: SubjectAccess
  ) => {
    setSelectedAccessById((prev) => {
      const next = { ...prev };

      if (access === "default") {
        delete next[subject.id];
      } else {
        next[subject.id] = access;
      }

      return next;
    });

    void onSetSubjectAccess(subject, access);
  };

  const isListLocked =
    Boolean(onSetBulkAccess) &&
    (resolvedBulkAccess === "allow" || resolvedBulkAccess === "deny");

  const renderEffectiveAccessIcon = (subject: PermissionSubject) => {
    if (!hasTriggeredEffectiveAccessCheck) {
      return null;
    }

    const allowed = effectiveAccessBySubjectId[subject.id] === true;

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={
              allowed
                ? "inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
                : "inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-50 text-red-600"
            }
          >
            {allowed ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <X className="h-3.5 w-3.5" />
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">
          Effective access: {allowed ? "Allowed" : "Denied"}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="space-y-3 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            {headerEntity ? (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-700">
                <Icon
                  name={headerEntity.icon || "playbook"}
                  className="h-4 w-4"
                />
              </span>
            ) : null}
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-gray-900">
                {headerEntity?.name || title}
              </div>
              {!headerEntity && description ? (
                <div className="mt-0.5 text-xs text-gray-500">
                  {description}
                </div>
              ) : null}
            </div>
          </div>

          {effectiveAccessResource ? (
            <Button
              type="button"
              size="sm"
              className="w-48 justify-center bg-blue-600 text-white hover:bg-blue-700"
              disabled={isCheckingEffectiveAccess || subjects.length === 0}
              onClick={() => {
                setHasTriggeredEffectiveAccessCheck(true);
                refetchEffectiveSubjectAccess();
              }}
            >
              {isCheckingEffectiveAccess
                ? "Checking effective access..."
                : "Check effective access"}
            </Button>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-gray-600">Global permission</div>

          <div
            className={
              isSubmitting || isBulkSubmitting || displayedSubjects.length === 0
                ? "pointer-events-none opacity-60"
                : undefined
            }
            aria-disabled={
              isSubmitting ||
              isBulkSubmitting ||
              displayedSubjects.length === 0 ||
              undefined
            }
          >
            <Switch
              size="sm"
              className="w-48"
              itemsClassName="flex-1 justify-center"
              options={[...BULK_OPTIONS]}
              value={bulkOptionValue}
              onChange={(value) => {
                const access: SubjectAccess =
                  value === "Allow all"
                    ? "allow"
                    : value === "Deny All"
                      ? "deny"
                      : "default";
                void setBulkSubjectAccess(access);
              }}
              getActiveItemClassName={(option) =>
                option === "Allow all"
                  ? "!bg-green-600 !text-white !ring-green-600"
                  : option === "Deny All"
                    ? "!bg-red-600 !text-white !ring-red-600"
                    : undefined
              }
            />
          </div>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 pt-3">
        <div className="flex h-full min-h-0 flex-col gap-3">
          <Input
            placeholder="Search ..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="mb-3 min-h-0 flex-1 space-y-4 overflow-y-auto">
            {isLoading || isFetching ? (
              <div className="flex items-center gap-2 p-2 text-sm text-gray-500">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                Loading subjects...
              </div>
            ) : displayedSubjects.length > 0 ? (
              groupedDisplayedSubjects.map((group) => (
                <div key={group.type} className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {TYPE_LABELS[group.type] ?? group.type}
                  </div>

                  <div className="overflow-hidden rounded-md border border-gray-200">
                    {group.subjects.map((subject) => (
                      <div
                        key={subject.id}
                        className="flex items-center justify-between gap-3 border-b border-gray-200 p-3 last:border-b-0"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-2 pr-2">
                          <SubjectAvatar subject={subject} size="xs" />
                          <div className="min-w-0 truncate text-sm font-medium text-gray-900">
                            {subject.name}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {renderEffectiveAccessIcon(subject)}
                          {!isListLocked ? (
                            <TriStateAccessSwitch
                              value={
                                selectedAccessById[subject.id] ?? "default"
                              }
                              disabled={
                                isSubmitting || mutatingSubjectId === subject.id
                              }
                              onChange={(next) =>
                                setSubjectAccess(subject, next)
                              }
                            />
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-2 text-sm text-gray-500">No subjects found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
