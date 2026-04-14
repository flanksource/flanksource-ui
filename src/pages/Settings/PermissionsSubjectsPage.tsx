import { fetchAllPermissionSubjects } from "@flanksource-ui/api/services/permissions";
import PermissionSubjectPanel, {
  PermissionSubjectGroup
} from "@flanksource-ui/components/Permissions/PermissionSubjectPanel";
import PermissionsTabsLinks from "@flanksource-ui/components/Permissions/PermissionsTabsLinks";
import useDebouncedValue from "@flanksource-ui/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

const SUBJECT_TYPE_ORDER = {
  role: 0,
  permission_subject_group: 1,
  team: 2,
  person: 3,
  access_token_person: 4
} as const;

export function PermissionsSubjectsPage() {
  const [subjectSearch, setSubjectSearch] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  );

  const debouncedSearch = useDebouncedValue(subjectSearch, 200) ?? "";

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

  return (
    <PermissionsTabsLinks
      activeTab="Subjects"
      loading={isLoading || isRefetching}
      onRefresh={() => refetch()}
    >
      <div className="flex h-full min-h-0 w-full flex-1 flex-col gap-4 p-6 pb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Subjects</h3>
          <p className="text-sm text-gray-600">
            Browse permission subjects. Subject details and actions will be
            added here.
          </p>
        </div>

        <div className="flex min-h-0 flex-1 gap-4">
          <PermissionSubjectPanel
            subjectSearch={subjectSearch}
            onSubjectSearchChange={setSubjectSearch}
            groupedSubjects={groupedSubjects}
            selectedSubjectId={selectedSubjectId}
            onSelectSubject={setSelectedSubjectId}
          />

          <div className="min-h-0 min-w-0 flex-1 lg:max-w-3xl">
            <div className="flex h-full items-center justify-center rounded-md border border-dashed border-gray-200 p-4 text-sm text-gray-500">
              {selectedSubject
                ? `Selected subject: ${selectedSubject.name}`
                : "Select a subject."}
            </div>
          </div>
        </div>
      </div>
    </PermissionsTabsLinks>
  );
}
