import {
  fetchPermissionSubjectsByIds,
  fetchPermissionSubjectsPaginated,
  PermissionSubject
} from "@flanksource-ui/api/services/permissions";
import { Button } from "@flanksource-ui/components/ui/button";
import { Switch } from "@flanksource-ui/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@flanksource-ui/components/ui/dialog";
import { Input } from "@flanksource-ui/components/ui/input";
import useDebouncedValue from "@flanksource-ui/hooks/useDebounce";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
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

type SubjectSelectorModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onAllow?: (selection: PermissionSubject[]) => Promise<void> | void;
  preselectedSubjectIds?: string[];
  isSubmitting?: boolean;
};

function SubjectIcon({ subject }: { subject: PermissionSubject }) {
  if (subject.type === "person") {
    return <Avatar size="xs" user={{ name: subject.name }} />;
  }

  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
      {subject.type === "team" ? (
        <HiUserGroup className="h-3 w-3" />
      ) : (
        <HiUser className="h-3 w-3" />
      )}
    </span>
  );
}

export default function SubjectSelectorModal({
  open,
  onOpenChange,
  title,
  description,
  onAllow,
  preselectedSubjectIds = [],
  isSubmitting = false
}: SubjectSelectorModalProps) {
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Record<string, true>>({});
  const [selectedSubjects, setSelectedSubjects] = useState<
    Record<string, PermissionSubject>
  >({});

  const prevOpenRef = useRef(false);
  const preselectedSubjectIdsRef = useRef(preselectedSubjectIds);
  preselectedSubjectIdsRef.current = preselectedSubjectIds;
  const initialSelectedIdsRef = useRef<Record<string, true>>({});

  useEffect(() => {
    const wasOpen = prevOpenRef.current;
    prevOpenRef.current = open;

    if (!open) {
      setSearch("");
      setPageIndex(0);
      setSelectedIds({});
      setSelectedSubjects({});
      return;
    }

    if (!wasOpen) {
      const idMap: Record<string, true> = {};
      for (const id of preselectedSubjectIdsRef.current) {
        idMap[id] = true;
      }
      initialSelectedIdsRef.current = idMap;
      setSelectedIds(idMap);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const shouldFetchSubjectsByIds = open && preselectedSubjectIds.length > 0;

  const { data: subjectsByIds = [], isLoading: isSubjectsByIdsLoading } =
    useQuery({
      queryKey: ["permission-subjects-by-ids", preselectedSubjectIds],
      queryFn: () => fetchPermissionSubjectsByIds(preselectedSubjectIds),
      enabled: shouldFetchSubjectsByIds,
      staleTime: 60_000,
      onSuccess: (data) => {
        setSelectedSubjects((prev) => {
          const next = { ...prev };
          for (const subject of data) {
            next[subject.id] = subject;
          }
          return next;
        });
      }
    });

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
      }),
    enabled: open
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
  const initialIds = initialSelectedIdsRef.current;
  const hasChanged =
    selectedCount !== Object.keys(initialIds).length ||
    Object.keys(selectedIds).some((id) => !initialIds[id]);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[70vh] max-h-[70vh] max-w-3xl flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        <Input
          placeholder="Search users or groups"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto rounded-md border p-2">
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

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div>
            Selected: {selectedCount} subject
            {selectedCount === 1 ? "" : "s"}
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
              onClick={() =>
                setPageIndex((p) => (p + 1 < pageCount ? p + 1 : p))
              }
            >
              Next
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!hasChanged || isSubmitting}
            onClick={() => onAllow?.(Object.values(selectedSubjects))}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
