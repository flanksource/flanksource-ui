import {
  fetchPermissionSubjectsByIds,
  fetchPermissionSubjectsPaginated,
  PermissionSubject
} from "@flanksource-ui/api/services/permissions";
import { Badge } from "@flanksource-ui/components/ui/badge";
import { Button } from "@flanksource-ui/components/ui/button";
import { Checkbox } from "@flanksource-ui/components/ui/checkbox";
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

type SubjectSelectorModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onAllow: (selection: PermissionSubject[]) => Promise<void> | void;
  preselectedSubjectIds?: string[];
  isSubmitting?: boolean;
};

function SubjectIcon({ subject }: { subject: PermissionSubject }) {
  if (subject.type === "person") {
    return <Avatar size="xs" user={{ name: subject.name }} />;
  }

  // teams and groups get a group icon instead of an initials-based avatar
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

  // Track previous open value so we only initialise state on the
  // false → true transition, not on every render.
  const prevOpenRef = useRef(false);
  // Keep a stable ref to the latest preselectedSubjectIds so the
  // open-transition effect below doesn't need it in its dep array.
  const preselectedSubjectIdsRef = useRef(preselectedSubjectIds);
  preselectedSubjectIdsRef.current = preselectedSubjectIds;
  // Snapshot of selected IDs at the moment the modal opened, used to
  // detect whether the selection has actually changed.
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
      // Modal just opened — pre-check the supplied IDs. Full subject
      // objects are fetched separately by the query below; here we
      // only mark the IDs as selected so checkboxes render correctly
      // immediately.
      const idMap: Record<string, true> = {};
      for (const id of preselectedSubjectIdsRef.current) {
        idMap[id] = true;
      }
      initialSelectedIdsRef.current = idMap;
      setSelectedIds(idMap);
    }
    // Intentionally only depend on `open` — we read preselectedSubjectIds
    // through a ref to avoid resetting user selections on parent re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Fetch full subject objects for every preselected ID so that
  // `selectedSubjects` is complete even when those subjects live on a
  // different page of results.
  useQuery({
    queryKey: ["permission-subjects-by-ids", preselectedSubjectIds],
    queryFn: () => fetchPermissionSubjectsByIds(preselectedSubjectIds),
    enabled: open && preselectedSubjectIds.length > 0,
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

  const subjects = useMemo(
    () => (data?.data ?? []) as PermissionSubject[],
    [data?.data]
  );
  const totalEntries = data?.totalEntries ?? 0;
  const pageCount = Math.ceil(totalEntries / PAGE_SIZE);

  // Enrich selectedSubjects as new pages are loaded.
  useEffect(() => {
    if (subjects.length === 0) {
      return;
    }

    setSelectedSubjects((prev) => {
      const next = { ...prev };
      for (const subject of subjects) {
        if (selectedIds[subject.id]) {
          next[subject.id] = subject;
        }
      }
      return next;
    });
  }, [subjects, selectedIds]);

  const selectedCount = Object.keys(selectedIds).length;

  // Apply is a no-op only when the selection is identical to what was
  // preselected on open (same IDs, same count). Submitting an empty
  // selection is valid — it means "remove everyone".
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
      <DialogContent className="flex h-[640px] max-w-2xl flex-col">
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

        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto rounded-md border p-2">
          {isLoading ? (
            <div className="p-2 text-sm text-gray-500">Loading...</div>
          ) : subjects.length > 0 ? (
            subjects.map((subject) => (
              <label
                key={subject.id}
                className="flex cursor-pointer items-center justify-between rounded px-2 py-1.5 hover:bg-gray-50"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2 pr-2">
                  <Checkbox
                    checked={!!selectedIds[subject.id]}
                    onCheckedChange={(checked) =>
                      toggleSubject(subject, checked === true)
                    }
                  />
                  <SubjectIcon subject={subject} />
                  <div className="min-w-0 truncate text-sm font-medium text-gray-900">
                    {subject.name}
                  </div>
                </div>

                <div className="ml-2 flex shrink-0 items-center">
                  <Badge variant="outline" className="text-[10px] font-normal">
                    {TYPE_LABELS[subject.type] ?? subject.type}
                  </Badge>
                </div>
              </label>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500">No subjects found</div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
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
            onClick={() => onAllow(Object.values(selectedSubjects))}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
