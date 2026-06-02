import { fetchAllPermissionSubjects } from "@flanksource-ui/api/services/permissions";
import PermissionSubjectPanel, {
  PermissionSubjectGroup
} from "@flanksource-ui/components/Permissions/PermissionSubjectPanel";
import SubjectPermissionsWorkbench from "@flanksource-ui/components/Permissions/SubjectPermissionsWorkbench";
import PermissionsTabsLinks from "@flanksource-ui/components/Permissions/PermissionsTabsLinks";
import useDebouncedValue from "@flanksource-ui/hooks/useDebounce";
import { useIsFetching, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

const SUBJECT_TYPE_ORDER = {
  role: 0,
  permission_subject_group: 1,
  team: 2,
  playbook: 3,
  plugin: 4,
  person: 5,
  access_token_person: 6
} as const;

export function PermissionsSubjectsPage() {
  const [subjectSearch, setSubjectSearch] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  );

  const debouncedSearch = useDebouncedValue(subjectSearch, 200) ?? "";

  const queryClient = useQueryClient();

  const {
    data: subjects = [],
    isLoading,
    isRefetching,
    refetch
  } = useQuery({
    queryKey: ["permissions", "subjects", "all"],
    queryFn: fetchAllPermissionSubjects
  });

  const sortedSubjects = useMemo(() => {
    const loweredSearch = debouncedSearch.trim().toLowerCase();

    return subjects
      .filter((subject) => {
        if (!loweredSearch) {
          return true;
        }

        return subject.name.toLowerCase().includes(loweredSearch);
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

  const groupedSubjects = useMemo<PermissionSubjectGroup[]>(() => {
    const grouped = new Map<PermissionSubjectGroup["type"], typeof subjects>();

    for (const subject of sortedSubjects) {
      const list = grouped.get(subject.type) ?? [];
      list.push(subject);
      grouped.set(subject.type, list);
    }

    return Array.from(grouped.entries()).map(([type, list]) => ({
      type,
      list
    }));
  }, [sortedSubjects]);

  useEffect(() => {
    if (
      selectedSubjectId &&
      sortedSubjects.some((subject) => subject.id === selectedSubjectId)
    ) {
      return;
    }

    setSelectedSubjectId(sortedSubjects[0]?.id ?? null);
  }, [selectedSubjectId, sortedSubjects]);

  const selectedSubject = useMemo(
    () =>
      sortedSubjects.find((subject) => subject.id === selectedSubjectId) ??
      null,
    [selectedSubjectId, sortedSubjects]
  );

  const isWorkbenchFetching =
    useIsFetching({ queryKey: ["permissions-subjects"] }) > 0;

  const onRefresh = useCallback(async () => {
    await Promise.all([
      refetch(),
      queryClient.invalidateQueries({ queryKey: ["permissions-subjects"] })
    ]);
  }, [queryClient, refetch]);

  return (
    <PermissionsTabsLinks
      activeTab="Subjects"
      loading={isLoading || isRefetching || isWorkbenchFetching}
      onRefresh={onRefresh}
    >
      <div className="flex w-full flex-col gap-4 p-4 lg:flex-row lg:gap-4">
        <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[220px]">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Subjects</h3>
          </div>

          <PermissionSubjectPanel
            subjectSearch={subjectSearch}
            onSubjectSearchChange={setSubjectSearch}
            groupedSubjects={groupedSubjects}
            selectedSubjectId={selectedSubjectId}
            onSelectSubject={setSelectedSubjectId}
          />
        </div>

        <div className="min-w-0 flex-1">
          {selectedSubject ? (
            <SubjectPermissionsWorkbench selectedSubject={selectedSubject} />
          ) : (
            <div className="flex h-full items-center justify-center rounded-md border border-dashed border-gray-200 p-4 text-sm text-gray-500">
              Select a subject.
            </div>
          )}
        </div>
      </div>
    </PermissionsTabsLinks>
  );
}
