import {
  fetchPermissionSubjectsByIds,
  fetchPermissionSubjectsPaginated,
  PermissionSubject
} from "@flanksource-ui/api/services/permissions";
import { Button } from "@flanksource-ui/components/ui/button";
import { Switch } from "@flanksource-ui/components/ui/switch";
import { Input } from "@flanksource-ui/components/ui/input";
import useDebouncedValue from "@flanksource-ui/hooks/useDebounce";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { HiUser, HiUserGroup } from "react-icons/hi";

const PAGE_SIZE = 20;

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

type SubjectSelectorPanelProps = {
  description?: string;
  onAllow?: (selection: PermissionSubject[]) => Promise<void> | void;
  preselectedSubjectIds?: string[];
  isSubmitting?: boolean;
  onClose?: () => void;
};

function SubjectIcon({ subject }: { subject: PermissionSubject }) {
  if (subject.type === "person") {
    return <Avatar size="xs" user={{ name: subject.name }} />;
  }

  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
      {subject.type === "team" ||
      subject.type === "permission_subject_group" ? (
        <HiUserGroup className="h-3 w-3" />
      ) : (
        <HiUser className="h-3 w-3" />
      )}
    </span>
  );
}

export default function SubjectSelectorPanel({
  description,
  onAllow,
  preselectedSubjectIds = [],
  isSubmitting = false,
  onClose
}: SubjectSelectorPanelProps) {
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Record<string, true>>({});
  const [selectedSubjects, setSelectedSubjects] = useState<
    Record<string, PermissionSubject>
  >({});
  const [initialSelectedIds, setInitialSelectedIds] = useState<
    Record<string, true>
  >({});

  const normalizedPreselectedSubjectIds = useMemo(
    () => [...new Set(preselectedSubjectIds)].sort(),
    [preselectedSubjectIds]
  );
  const preselectedSubjectIdsSignature = useMemo(
    () => normalizedPreselectedSubjectIds.join("|"),
    [normalizedPreselectedSubjectIds]
  );

  useEffect(() => {
    const ids = preselectedSubjectIdsSignature
      ? preselectedSubjectIdsSignature.split("|")
      : [];

    const idMap: Record<string, true> = {};
    for (const id of ids) {
      idMap[id] = true;
    }

    setSearch("");
    setPageIndex(0);
    setSelectedIds(idMap);
    setSelectedSubjects({});
    setInitialSelectedIds(idMap);
  }, [preselectedSubjectIdsSignature]);

  const shouldFetchSubjectsByIds = normalizedPreselectedSubjectIds.length > 0;

  const { data: subjectsByIds = [], isLoading: isSubjectsByIdsLoading } =
    useQuery({
      queryKey: ["permission-subjects-by-ids", normalizedPreselectedSubjectIds],
      queryFn: () =>
        fetchPermissionSubjectsByIds(normalizedPreselectedSubjectIds),
      enabled: shouldFetchSubjectsByIds,
      staleTime: 60_000
    });

  useEffect(() => {
    if (subjectsByIds.length === 0) {
      return;
    }

    setSelectedSubjects((prev) => {
      const next = { ...prev };
      for (const subject of subjectsByIds) {
        next[subject.id] = subject;
      }
      return next;
    });
  }, [subjectsByIds]);

  const debouncedSearch = useDebouncedValue(search, 300) ?? "";

  useEffect(() => {
    setPageIndex(0);
  }, [debouncedSearch]);

  const { data, isLoading } = useQuery({
    queryKey: [
      "mcp",
      "subject-selector",
      debouncedSearch,
      pageIndex,
      PAGE_SIZE
    ],
    queryFn: async () =>
      fetchPermissionSubjectsPaginated({
        search: debouncedSearch,
        pageIndex,
        pageSize: PAGE_SIZE
      })
  });

  const displayedSubjects = useMemo(
    () => (data?.data ?? []) as PermissionSubject[],
    [data?.data]
  );

  const groupedDisplayedSubjects = useMemo(() => {
    const seen = new Set<string>();
    const grouped = new Map<PermissionSubject["type"], PermissionSubject[]>();

    for (const subject of displayedSubjects) {
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
      .map(([type, groupedSubjects]) => ({
        type,
        subjects: groupedSubjects.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
        )
      }));
  }, [displayedSubjects]);

  const totalEntries = data?.totalEntries ?? 0;
  const pageCount = Math.ceil(totalEntries / PAGE_SIZE);

  useEffect(() => {
    if (subjectsByIds.length === 0) {
      return;
    }

    setSelectedSubjects((prev) => {
      const next = { ...prev };
      for (const subject of subjectsByIds) {
        if (selectedIds[subject.id]) {
          next[subject.id] = subject;
        }
      }
      return next;
    });
  }, [selectedIds, subjectsByIds]);

  useEffect(() => {
    if (displayedSubjects.length === 0) {
      return;
    }

    setSelectedSubjects((prev) => {
      const next = { ...prev };
      for (const subject of displayedSubjects) {
        if (selectedIds[subject.id]) {
          next[subject.id] = subject;
        }
      }
      return next;
    });
  }, [displayedSubjects, selectedIds]);

  const selectedCount = Object.keys(selectedIds).length;
  const hasChanged =
    selectedCount !== Object.keys(initialSelectedIds).length ||
    Object.keys(selectedIds).some((id) => !initialSelectedIds[id]);

  const toggleSubject = (subject: PermissionSubject, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) {
        return { ...prev, [subject.id]: true };
      }
      const next = { ...prev };
      delete next[subject.id];
      return next;
    });

    setSelectedSubjects((prev) => {
      if (checked) {
        return { ...prev, [subject.id]: subject };
      }
      const next = { ...prev };
      delete next[subject.id];
      return next;
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-md border border-gray-200 bg-white p-3">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          {description ? (
            <div className="mt-0.5 text-xs text-gray-500">{description}</div>
          ) : null}
        </div>
      </div>

      <Input
        placeholder="Search users, teams, groups, or roles"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="mt-3 min-h-0 flex-1 space-y-4 overflow-y-auto rounded-md border p-2">
        {(shouldFetchSubjectsByIds && isSubjectsByIdsLoading) || isLoading ? (
          <div className="p-2 text-sm text-gray-500">Loading...</div>
        ) : displayedSubjects.length > 0 ? (
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
                    <SubjectIcon subject={subject} />
                    <div className="min-w-0 truncate text-sm font-medium text-gray-900">
                      {subject.name}
                    </div>
                  </div>
                  <Switch
                    checked={!!selectedIds[subject.id]}
                    onCheckedChange={(checked) =>
                      toggleSubject(subject, checked)
                    }
                  />
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="p-2 text-sm text-gray-500">No subjects found</div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <div>
          Selected: {selectedCount} subject{selectedCount === 1 ? "" : "s"}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pageIndex === 0}
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
          >
            Previous
          </Button>
          <span>
            Page {pageCount === 0 ? 0 : pageIndex + 1} of {pageCount || 0}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pageCount === 0 || pageIndex + 1 >= pageCount}
            onClick={() => setPageIndex((p) => (p + 1 < pageCount ? p + 1 : p))}
          >
            Next
          </Button>
        </div>
      </div>

      <div className="mt-3 flex justify-end gap-2">
        {onClose ? (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        ) : null}
        <Button
          type="button"
          disabled={!hasChanged || isSubmitting}
          onClick={() => onAllow?.(Object.values(selectedSubjects))}
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
