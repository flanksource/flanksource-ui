import { getAllPlaybookNames } from "@flanksource-ui/api/services/playbooks";
import { PermissionSubject } from "@flanksource-ui/api/services/permissions";
import {
  searchSubjectAccess,
  SubjectAccessReviewAction
} from "@flanksource-ui/api/services/rbac";
import { getErrorMessage } from "@flanksource-ui/api/types/error";
import { getAllViews } from "@flanksource-ui/api/services/views";
import {
  ForbiddenSubjectsNotice,
  useMcpSubjects
} from "@flanksource-ui/components/MCP/McpSubjectAccessList";
import McpTabsLinks from "@flanksource-ui/components/MCP/McpTabsLinks";
import EffectiveAccessBadge from "@flanksource-ui/components/Permissions/EffectiveAccessBadge";
import PermissionSubjectPanel from "@flanksource-ui/components/Permissions/PermissionSubjectPanel";
import SubjectAvatar from "@flanksource-ui/components/Permissions/SubjectAvatar";
import AccessExplanationSheet, {
  AccessCheck
} from "@flanksource-ui/components/Permissions/SubjectPermissions/AccessExplanationSheet";
import { Input } from "@flanksource-ui/components/ui/input";
import useDebouncedValue from "@flanksource-ui/hooks/useDebounce";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { useQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type McpResource = {
  id: string;
  kind: "playbook" | "view";
  name: string;
  icon: string;
};

// What the MCP server checks to use each kind of resource: mcp:run to run a playbook, read to use a view.
const ACTIONS: Record<McpResource["kind"], SubjectAccessReviewAction> = {
  playbook: "mcp:run",
  view: "read"
};

const byName = (a: { name: string }, b: { name: string }) =>
  a.name.localeCompare(b.name, undefined, { sensitivity: "base" });

function ErrorBox({ error }: { error: unknown }) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {getErrorMessage(error)}
    </div>
  );
}

// McpSubjectAccessPage shows which playbooks and views one subject may use through MCP.
export default function McpSubjectAccessPage() {
  const [subjectSearch, setSubjectSearch] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  );
  const debouncedSearch =
    useDebouncedValue(subjectSearch, 200)?.trim().toLowerCase() ?? "";

  const { data, isLoading, error } = useMcpSubjects();
  const subjects = useMemo(() => data?.subjects ?? [], [data?.subjects]);

  const filteredSubjects = useMemo(
    () =>
      subjects
        .filter((subject) =>
          subject.name.toLowerCase().includes(debouncedSearch)
        )
        .sort(byName),
    [debouncedSearch, subjects]
  );

  const groupedSubjects = useMemo(
    () =>
      (["team", "person"] as const)
        .map((type) => ({
          type,
          list: filteredSubjects.filter((subject) => subject.type === type)
        }))
        .filter((group) => group.list.length > 0),
    [filteredSubjects]
  );

  useEffect(() => {
    if (
      !selectedSubjectId ||
      !filteredSubjects.some((subject) => subject.id === selectedSubjectId)
    ) {
      setSelectedSubjectId(groupedSubjects[0]?.list[0]?.id ?? null);
    }
  }, [filteredSubjects, groupedSubjects, selectedSubjectId]);

  const selectedSubject = subjects.find(
    (subject) => subject.id === selectedSubjectId
  );

  return (
    <McpTabsLinks activeTab="Subject access">
      <div className="flex h-full min-h-0 w-full flex-1 flex-col gap-4 p-6 pb-3">
        <div className="flex min-h-0 flex-1 gap-4">
          <div className="flex w-[320px] shrink-0 flex-col gap-3">
            <ForbiddenSubjectsNotice forbidden={data?.forbidden} />
            {error ? (
              <ErrorBox error={error} />
            ) : isLoading ? (
              <div className="px-2 py-1.5 text-sm text-gray-500">
                Loading subjects...
              </div>
            ) : (
              <PermissionSubjectPanel
                subjectSearch={subjectSearch}
                onSubjectSearchChange={setSubjectSearch}
                groupedSubjects={groupedSubjects}
                selectedSubjectId={selectedSubjectId}
                onSelectSubject={setSelectedSubjectId}
              />
            )}
          </div>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:max-w-3xl">
            {selectedSubject ? (
              <SubjectResources
                key={selectedSubject.id}
                subject={selectedSubject}
              />
            ) : !error && !isLoading ? (
              <div className="flex h-full items-center justify-center rounded-md border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                {subjects.length === 0
                  ? "No people or teams found."
                  : "Select a subject."}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </McpTabsLinks>
  );
}

function SubjectResources({ subject }: { subject: PermissionSubject }) {
  const [search, setSearch] = useState("");
  const [explaining, setExplaining] = useState<AccessCheck>();

  const playbooksQuery = useQuery({
    queryKey: ["mcp", "playbooks", "all"],
    queryFn: getAllPlaybookNames
  });

  const viewsQuery = useQuery({
    queryKey: ["mcp", "views", "all"],
    queryFn: async () => getAllViews([{ id: "name", desc: false }], 0, 1000)
  });

  const playbookSearch = useQuery({
    queryKey: ["mcp", "search", subject.id, "mcp:run"],
    queryFn: () =>
      searchSubjectAccess({
        subject: subject.id,
        action: "mcp:run",
        resource_types: ["playbook"]
      })
  });

  const viewSearch = useQuery({
    queryKey: ["mcp", "search", subject.id, "read", "view"],
    queryFn: () =>
      searchSubjectAccess({
        subject: subject.id,
        action: "read",
        resource_types: ["view"]
      })
  });

  const queries = [playbooksQuery, viewsQuery, playbookSearch, viewSearch];
  const error = queries.find((query) => query.error)?.error;
  const isLoading = queries.some((query) => query.isLoading);

  // Every MCP request takes mcp:use, and the search for mcp:run reports it as a requirement
  const mcpUse = playbookSearch.data?.requirements?.find(
    (requirement) => requirement.action === "mcp:use"
  );
  const canUseMcp = mcpUse?.allowed !== false;

  const allowed = useMemo(
    () =>
      new Set(
        [
          ...(playbookSearch.data?.results ?? []),
          ...(viewSearch.data?.results ?? [])
        ].map((result) => `${result.resource_type}:${result.id}`)
      ),
    [playbookSearch.data, viewSearch.data]
  );

  const normalizedSearch = search.trim().toLowerCase();
  const sections = useMemo(() => {
    const playbooks: McpResource[] = (playbooksQuery.data ?? []).map(
      (playbook) => ({
        id: playbook.id,
        kind: "playbook",
        name: playbook.title || playbook.name,
        icon: playbook.icon || "playbook"
      })
    );
    const views: McpResource[] = (viewsQuery.data?.data ?? []).map((view) => ({
      id: view.id,
      kind: "view",
      name: view.spec?.title || view.name,
      icon: view.spec?.icon || "workflow"
    }));

    return [
      { title: "Playbooks", resources: playbooks },
      { title: "Views", resources: views }
    ].map((section) => ({
      ...section,
      resources: section.resources
        .filter((resource) =>
          resource.name.toLowerCase().includes(normalizedSearch)
        )
        .sort(byName)
    }));
  }, [normalizedSearch, playbooksQuery.data, viewsQuery.data]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <SubjectAvatar subject={subject} size="md" />
        <div className="truncate text-sm font-semibold text-gray-900">
          {subject.name}
        </div>
      </div>

      {!canUseMcp ? (
        <button
          type="button"
          onClick={() => setExplaining({ action: "mcp:use", resource: {} })}
          className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-left text-sm text-amber-800 hover:bg-amber-100"
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {subject.name} may not use MCP (
            <code className="text-xs">mcp:use</code>), so they can&apos;t use
            any playbook or view through it.
          </span>
        </button>
      ) : null}

      <Input
        placeholder="Search playbooks and views..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pb-3">
        {error ? (
          <ErrorBox error={error} />
        ) : isLoading ? (
          <div className="flex items-center gap-2 p-2 text-sm text-gray-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            Reviewing access...
          </div>
        ) : (
          sections.map((section) => {
            const count = section.resources.filter(
              (resource) =>
                canUseMcp && allowed.has(`${resource.kind}:${resource.id}`)
            ).length;

            return (
              <div key={section.title} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <span>{section.title}</span>
                  <span className="font-normal normal-case">
                    {count} of {section.resources.length} allowed
                  </span>
                </div>
                {section.resources.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">
                    No {section.title.toLowerCase()} found
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-md border border-gray-200">
                    {section.resources.map((resource) => (
                      <button
                        key={resource.id}
                        type="button"
                        onClick={() =>
                          // Without mcp:use, that is what refuses every resource
                          setExplaining(
                            canUseMcp
                              ? {
                                  action: ACTIONS[resource.kind],
                                  resource: { [resource.kind]: resource.id },
                                  resourceLabel: resource.name
                                }
                              : { action: "mcp:use", resource: {} }
                          )
                        }
                        className="flex w-full items-center gap-2 border-b border-gray-200 p-3 text-left last:border-b-0 hover:bg-gray-50"
                      >
                        <Icon
                          name={resource.icon}
                          className="h-4 w-4 text-gray-500"
                        />
                        <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">
                          {resource.name}
                        </span>
                        <EffectiveAccessBadge
                          isAllowed={
                            canUseMcp &&
                            allowed.has(`${resource.kind}:${resource.id}`)
                          }
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <AccessExplanationSheet
        subject={subject}
        check={explaining}
        onClose={() => setExplaining(undefined)}
      />
    </div>
  );
}
