import {
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
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 20;

type SubjectSelectorModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onAllow: (selection: PermissionSubject[]) => Promise<void> | void;
  preselectedSubjectIds?: string[];
  isSubmitting?: boolean;
};

function typeLabel(type: PermissionSubject["type"]) {
  if (type === "permission_subject_group") {
    return "group";
  }

  return type;
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

  useEffect(() => {
    setPageIndex(0);
  }, [search]);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setPageIndex(0);
      setSelectedIds({});
      setSelectedSubjects({});
      return;
    }

    const preselectedMap: Record<string, true> = {};
    for (const id of preselectedSubjectIds) {
      preselectedMap[id] = true;
    }
    setSelectedIds(preselectedMap);
  }, [open, preselectedSubjectIds]);

  const { data, isLoading } = useQuery({
    queryKey: ["mcp", "subject-selector", search, pageIndex],
    queryFn: async () =>
      fetchPermissionSubjectsPaginated({
        search,
        pageIndex,
        pageSize: PAGE_SIZE
      }),
    enabled: open
  });

  const subjects = (data?.data ?? []) as PermissionSubject[];
  const totalEntries = data?.totalEntries ?? 0;
  const pageCount = Math.ceil(totalEntries / PAGE_SIZE);

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

  const selectedCount = useMemo(
    () => Object.keys(selectedIds).length,
    [selectedIds]
  );

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
                  <Avatar size="xs" user={{ name: subject.name }} />
                  <div className="min-w-0 truncate text-sm font-medium text-gray-900">
                    {subject.name}
                  </div>
                </div>

                <div className="ml-2 flex shrink-0 items-center">
                  <Badge variant="outline" className="text-[10px] font-normal">
                    {typeLabel(subject.type)}
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
            disabled={selectedCount === 0 || isSubmitting}
            onClick={() => onAllow(Object.values(selectedSubjects))}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
