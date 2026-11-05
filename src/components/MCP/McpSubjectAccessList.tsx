import {
  fetchAccessReviewSubjects,
  PermissionSubject
} from "@flanksource-ui/api/services/permissions";
import {
  reviewSubjectAccess,
  ReviewedRule,
  SubjectAccessReviewRequest,
  SubjectAccessReviewResult
} from "@flanksource-ui/api/services/rbac";
import { getErrorMessage } from "@flanksource-ui/api/types/error";
import EffectiveAccessBadge from "@flanksource-ui/components/Permissions/EffectiveAccessBadge";
import SubjectAvatar from "@flanksource-ui/components/Permissions/SubjectAvatar";
import AccessExplanationSheet, {
  AccessCheck
} from "@flanksource-ui/components/Permissions/SubjectPermissions/AccessExplanationSheet";
import { Input } from "@flanksource-ui/components/ui/input";
import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import useDebouncedValue from "@flanksource-ui/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

// A review explains at most this many subjects at once (MaxExplainedSubjects in mission-control).
const MAX_EXPLAINED_SUBJECTS = 50;

const MCP_SUBJECT_TYPES = ["person", "team"] as const;

// useMcpSubjects lists the people and teams whose MCP access can be reviewed, and those types the reviewer may not
// read, so none of them are listed.
export function useMcpSubjects() {
  return useQuery({
    queryKey: ["mcp", "subjects"],
    queryFn: async () => {
      const { subjects, forbidden } = await fetchAccessReviewSubjects();
      return {
        subjects: subjects.filter((subject) =>
          (MCP_SUBJECT_TYPES as readonly string[]).includes(subject.type)
        ),
        forbidden: forbidden.filter((type) =>
          (MCP_SUBJECT_TYPES as readonly string[]).includes(type)
        )
      };
    }
  });
}

// ForbiddenSubjectsNotice says which types of subject aren't listed because the reviewer may not read them.
export function ForbiddenSubjectsNotice({
  forbidden = []
}: {
  forbidden?: readonly string[];
}) {
  if (forbidden.length === 0) {
    return null;
  }
  const names = forbidden.map((type) => (type === "team" ? "teams" : "people"));
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      You may not read {names.join(" or ")}, so they aren&apos;t listed.
    </div>
  );
}

// reviewAllSubjects reviews every subject the policy grants something to, with the rules that decide each answer.
// A subject missing from the results holds no grant, so it's denied.
async function reviewAllSubjects(
  request: Omit<SubjectAccessReviewRequest, "subjects" | "explain">
) {
  const all = await reviewSubjectAccess({ ...request, subjects: ["*"] });
  const subjects = (all.results ?? []).map((result) => result.subject);

  const chunks: string[][] = [];
  for (let i = 0; i < subjects.length; i += MAX_EXPLAINED_SUBJECTS) {
    chunks.push(subjects.slice(i, i + MAX_EXPLAINED_SUBJECTS));
  }

  const explained = await Promise.all(
    chunks.map((chunk) =>
      reviewSubjectAccess({ ...request, subjects: chunk, explain: true })
    )
  );

  return new Map(
    explained
      .flatMap((response) => response.results ?? [])
      .map((result) => [result.subject, result] as const)
  );
}

type Row = {
  subject: PermissionSubject;
  allowed: boolean;
  reason: string;
  // The check that refuses or allows the subject, which selecting it explains.
  explain: AccessCheck;
};

const FILTERS = ["All", "Allowed", "Denied"] as const;

export const MCP_USE_CHECK: AccessCheck = { action: "mcp:use", resource: {} };

function bindingName(rule: ReviewedRule) {
  if (rule.hidden) {
    return "a RoleBinding you can't read";
  }
  if (rule.role_binding) {
    return `${rule.role_binding.namespace}/${rule.role_binding.name}`;
  }
  if (rule.permission) {
    return `legacy Permission ${rule.permission.name}`;
  }
  return "a grant of the policy";
}

// describe says which RoleBindings decide a subject's answer, and how they hold them.
function describe(result: SubjectAccessReviewResult | undefined) {
  if (!result) {
    return "No RoleBinding grants it";
  }
  if (result.error) {
    return result.error;
  }

  const deciding = (result.rules ?? []).filter((rule) => rule.matches);
  const denies = deciding.filter((rule) => rule.effect === "deny");
  const rules = denies.length > 0 ? denies : deciding;

  const refused = (result.requirements ?? []).filter(
    (requirement) => !requirement.allowed
  );
  const missing =
    result.allowed && refused.length > 0
      ? ` · needs ${refused.map((requirement) => requirement.action).join(", ")}`
      : "";

  if (rules.length === 0) {
    return `No RoleBinding grants it${missing}`;
  }

  const [first, ...rest] = rules;
  const through = (first.through ?? [])
    .map((subject) => subject.name)
    .filter(Boolean);
  return [
    `${denies.length > 0 ? "Denied" : "Granted"} by ${bindingName(first)}`,
    through.length > 0 ? ` through ${through.join(", ")}` : "",
    rest.length > 0 ? ` and ${rest.length} more` : "",
    missing
  ].join("");
}

type McpSubjectAccessListProps = {
  // The check to review for every subject.
  check: AccessCheck;
  // Whether the access also takes mcp:use, which the review of the check doesn't count, e.g. read on a view.
  requireMcpUse?: boolean;
  header?: React.ReactNode;
};

// McpSubjectAccessList lists every person and team with whether the policy allows them the check, and the RoleBinding
// that decides it. Selecting one explains the decision.
export default function McpSubjectAccessList({
  check,
  requireMcpUse = false,
  header
}: McpSubjectAccessListProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [explaining, setExplaining] = useState<{
    subject: PermissionSubject;
    check: AccessCheck;
  }>();
  const debouncedSearch =
    useDebouncedValue(search, 200)?.trim().toLowerCase() ?? "";

  const subjectsQuery = useMcpSubjects();

  const reviewQuery = useQuery({
    queryKey: ["mcp", "review", check.action, check.resource],
    queryFn: () =>
      reviewAllSubjects({ action: check.action, resource: check.resource })
  });

  const mcpUseQuery = useQuery({
    queryKey: ["mcp", "review", "mcp:use", {}],
    queryFn: () => reviewAllSubjects({ action: "mcp:use", resource: {} }),
    enabled: requireMcpUse
  });

  const error =
    subjectsQuery.error ?? reviewQuery.error ?? mcpUseQuery.error ?? null;
  const isLoading =
    subjectsQuery.isLoading ||
    reviewQuery.isLoading ||
    (requireMcpUse && mcpUseQuery.isLoading);

  const rows = useMemo<Row[]>(() => {
    const results =
      reviewQuery.data ?? new Map<string, SubjectAccessReviewResult>();
    return (subjectsQuery.data?.subjects ?? [])
      .filter((subject) => subject.name.toLowerCase().includes(debouncedSearch))
      .map((subject) => {
        const result = results.get(subject.id);
        const mcpUse = mcpUseQuery.data?.get(subject.id);
        const canUseMcp = !requireMcpUse || mcpUse?.allowed === true;
        const allowed =
          result?.allowed === true &&
          (result.requirements ?? []).every(
            (requirement) => requirement.allowed
          ) &&
          canUseMcp;

        // A subject the check allows but mcp:use refuses is refused by mcp:use, so that's what is explained
        const refusedByMcpUse = result?.allowed === true && !canUseMcp;
        return {
          subject,
          allowed,
          reason: refusedByMcpUse
            ? `${describe(result)} · needs mcp:use`
            : describe(result),
          explain: refusedByMcpUse ? MCP_USE_CHECK : check
        };
      })
      .sort(
        (a, b) =>
          Number(b.allowed) - Number(a.allowed) ||
          a.subject.name.localeCompare(b.subject.name, undefined, {
            sensitivity: "base"
          })
      );
  }, [
    check,
    debouncedSearch,
    mcpUseQuery.data,
    requireMcpUse,
    reviewQuery.data,
    subjectsQuery.data
  ]);

  const allowedCount = rows.filter((row) => row.allowed).length;
  const counts = {
    All: rows.length,
    Allowed: allowedCount,
    Denied: rows.length - allowedCount
  };
  const shownRows = rows.filter(
    (row) => filter === "All" || row.allowed === (filter === "Allowed")
  );

  const groups = (["team", "person"] as const)
    .map((type) => ({
      type,
      rows: shownRows.filter((row) => row.subject.type === type)
    }))
    .filter((group) => group.rows.length > 0);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {header}

      <ForbiddenSubjectsNotice forbidden={subjectsQuery.data?.forbidden} />

      <div className="flex items-center gap-3">
        <Input
          className="flex-1"
          placeholder="Search people and teams..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Switch
          size="sm"
          options={FILTERS.map((option) =>
            isLoading || error ? option : `${option} (${counts[option]})`
          )}
          value={isLoading || error ? filter : `${filter} (${counts[filter]})`}
          onChange={(option) =>
            setFilter(option.split(" ")[0] as (typeof FILTERS)[number])
          }
        />
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pb-3">
        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {getErrorMessage(error)}
          </div>
        ) : isLoading ? (
          <div className="flex items-center gap-2 p-2 text-sm text-gray-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            Reviewing access...
          </div>
        ) : groups.length === 0 ? (
          <div className="p-2 text-sm text-gray-500">
            {rows.length === 0
              ? "No people or teams found"
              : `No ${filter.toLowerCase()} people or teams`}
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.type} className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {group.type === "team" ? "Teams" : "People"}
              </div>
              <div className="overflow-hidden rounded-md border border-gray-200">
                {group.rows.map((row) => (
                  <button
                    key={row.subject.id}
                    type="button"
                    onClick={() =>
                      setExplaining({
                        subject: row.subject,
                        check: row.explain
                      })
                    }
                    className="flex w-full items-center gap-3 border-b border-gray-200 p-3 text-left last:border-b-0 hover:bg-gray-50"
                  >
                    <SubjectAvatar subject={row.subject} size="xs" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-gray-900">
                        {row.subject.name}
                      </div>
                      <div className="truncate text-xs text-gray-500">
                        {row.reason}
                      </div>
                    </div>
                    <EffectiveAccessBadge isAllowed={row.allowed} />
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-gray-100 pt-3 text-xs text-gray-500">
        Access is granted by{" "}
        <Link
          to="/settings/permissions/role-bindings"
          className="text-blue-600 hover:underline"
        >
          Role Bindings
        </Link>
        . Select a subject to see the rules that decide it.
      </div>

      {explaining ? (
        <AccessExplanationSheet
          subject={explaining.subject}
          check={explaining.check}
          onClose={() => setExplaining(undefined)}
        />
      ) : null}
    </div>
  );
}
