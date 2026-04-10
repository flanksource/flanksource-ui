import {
  fetchAllPermissionSubjects,
  PermissionSubject
} from "@flanksource-ui/api/services/permissions";
import SubjectAvatar from "@flanksource-ui/components/Permissions/SubjectAvatar";
import TriStateAccessSwitch from "@flanksource-ui/components/Permissions/TriStateAccessSwitch";
import { Button } from "@flanksource-ui/components/ui/button";
import { Input } from "@flanksource-ui/components/ui/input";
import useDebouncedValue from "@flanksource-ui/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
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

type SubjectAccess = "deny" | "default" | "allow";

type SubjectSelectorPanelProps = {
  title?: string;
  description?: string;
  preselectedSubjectAccess?: Record<string, "allow" | "deny">;
  isSubmitting?: boolean;
  mutatingSubjectId?: string | null;
  onClose?: () => void;
  onSetSubjectAccess: (
    subject: PermissionSubject,
    access: SubjectAccess
  ) => Promise<void> | void;
};

export default function SubjectSelectorPanel({
  title,
  description,
  preselectedSubjectAccess = {},
  isSubmitting = false,
  mutatingSubjectId,
  onClose,
  onSetSubjectAccess
}: SubjectSelectorPanelProps) {
  const [search, setSearch] = useState("");
  const [selectedAccessById, setSelectedAccessById] = useState<
    Record<string, SubjectAccess>
  >({});

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

  const filteredSubjects = useMemo(() => {
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

  const groupedDisplayedSubjects = useMemo(() => {
    const grouped = new Map<PermissionSubject["type"], PermissionSubject[]>();

    for (const subject of filteredSubjects) {
      const list = grouped.get(subject.type) ?? [];
      list.push(subject);
      grouped.set(subject.type, list);
    }

    return Array.from(grouped.entries())
      .sort((a, b) => SUBJECT_TYPE_ORDER[a[0]] - SUBJECT_TYPE_ORDER[b[0]])
      .map(([type, groupedSubjects]) => ({
        type,
        subjects: groupedSubjects
      }));
  }, [filteredSubjects]);

  const selectedCount = Object.keys(selectedAccessById).filter(
    (id) => selectedAccessById[id] !== "default"
  ).length;

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

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-md border border-gray-200 bg-white p-3">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          {title ? (
            <div className="text-sm font-semibold text-gray-900">{title}</div>
          ) : null}
          {description ? (
            <div className="mt-0.5 text-xs text-gray-500">{description}</div>
          ) : null}
        </div>
        {onClose ? (
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        ) : null}
      </div>

      <Input
        placeholder="Search users, teams, groups, or roles"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="mt-2 text-xs text-gray-500">
        Selected: {selectedCount} subject{selectedCount === 1 ? "" : "s"}
      </div>

      <div className="relative mt-3 min-h-0 flex-1 space-y-4 overflow-y-auto rounded-md">
        {isLoading || isFetching ? (
          <div className="flex items-center gap-2 p-2 text-sm text-gray-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            Loading subjects...
          </div>
        ) : filteredSubjects.length > 0 ? (
          groupedDisplayedSubjects.map((group) => (
            <div key={group.type} className="space-y-1">
              <div className="px-2 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-500 first:pt-0">
                {TYPE_LABELS[group.type] ?? group.type}
              </div>

              {group.subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="flex items-center justify-between rounded px-2 py-1.5 hover:bg-gray-50"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2 pr-2">
                    <SubjectAvatar subject={subject} size="xs" />
                    <div className="min-w-0 truncate text-sm font-medium text-gray-900">
                      {subject.name}
                    </div>
                  </div>

                  <TriStateAccessSwitch
                    value={selectedAccessById[subject.id] ?? "default"}
                    disabled={isSubmitting || mutatingSubjectId === subject.id}
                    onChange={(next) => setSubjectAccess(subject, next)}
                  />
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="p-2 text-sm text-gray-500">No subjects found</div>
        )}
      </div>
    </div>
  );
}
