/**
 * Side sheet that explains one cell of the subject access matrix: whether the
 * subject may perform the action, and the RoleBindings and rules that decide it.
 */
import { PermissionSubject } from "@flanksource-ui/api/services/permissions";
import {
  reviewSubjectAccess,
  ReviewRequirement,
  ReviewedRule,
  SubjectAccessReviewAction,
  SubjectAccessReviewResource
} from "@flanksource-ui/api/services/rbac";
import { getErrorMessage } from "@flanksource-ui/api/types/error";
import SubjectAvatar from "@flanksource-ui/components/Permissions/SubjectAvatar";
import {
  ACTION_LABELS,
  AccessTarget
} from "@flanksource-ui/components/Permissions/SubjectPermissions/shared";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@flanksource-ui/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Ban, Check, ChevronRight, CircleSlash, Info, X } from "lucide-react";
import { Link } from "react-router-dom";

export type AccessCheck = {
  action: SubjectAccessReviewAction;
  resource: SubjectAccessReviewResource;
  // What the action is checked on, as the reviewer reads it, e.g. a playbook's title.
  resourceLabel?: string;
  target?: AccessTarget;
};

type AccessExplanationSheetProps = {
  subject: PermissionSubject;
  check?: AccessCheck;
  onClose: () => void;
};

export default function AccessExplanationSheet({
  subject,
  check,
  onClose
}: AccessExplanationSheetProps) {
  const resource = check
    ? {
        ...check.resource,
        ...(check.target ? { [check.target.type]: check.target.id } : {})
      }
    : undefined;

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "permissions-subjects",
      "explain",
      subject.id,
      check?.action,
      resource
    ],
    enabled: !!check,
    queryFn: () =>
      reviewSubjectAccess({
        resource: resource!,
        action: check!.action,
        subjects: [subject.id],
        explain: true
      })
  });

  const result = data?.results?.[0];
  const rules = result?.rules ?? [];
  const deciding = rules.filter((rule) => rule.matches);
  const notApplying = rules.filter((rule) => !rule.matches);
  const actionLabel = check
    ? (ACTION_LABELS[check.action]?.label ?? check.action)
    : "";

  return (
    <Sheet open={!!check} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="flex w-full flex-col gap-4 overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <SubjectAvatar subject={subject} size="md" />
            <span className="truncate">{subject.name}</span>
          </SheetTitle>
          <SheetDescription>
            May they{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-xs text-gray-800">
              {check?.action}
            </code>
            {check?.resourceLabel ? (
              <>
                {" "}
                on{" "}
                <span className="font-medium text-gray-800">
                  {check.resourceLabel}
                </span>
              </>
            ) : null}
            {check?.target ? (
              <>
                {" "}
                targeting{" "}
                <span className="font-medium text-gray-800">
                  {check.target.name}
                </span>
              </>
            ) : null}
            ?
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            Reviewing access...
          </div>
        ) : error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {getErrorMessage(error)}
          </div>
        ) : result?.error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {result.error}
          </div>
        ) : result ? (
          <>
            <Verdict
              allowed={result.allowed}
              deciding={deciding}
              actionLabel={actionLabel}
              refusedBy={(result.requirements ?? [])
                .filter((requirement) => !requirement.allowed)
                .map(
                  (requirement) =>
                    `${requirement.action} on ${requirementTarget(requirement, check)}`
                )}
            />

            {result.requirements?.length ? (
              <section className="flex flex-col gap-2">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  The operation also checks
                </h4>
                <ul className="flex flex-col gap-1">
                  {result.requirements.map((requirement) => (
                    <li
                      key={`${requirement.action}:${requirement.on}`}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      {requirement.allowed ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-600" />
                      )}
                      <code className="rounded bg-gray-100 px-1 text-xs">
                        {requirement.action}
                      </code>
                      <span className="text-xs text-gray-500">
                        on {requirementTarget(requirement, check)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {data?.object ||
            (data?.requires && !result.requirements?.length) ? (
              <div className="flex flex-col gap-1.5 rounded-md bg-gray-50 p-3 text-xs text-gray-600">
                {data.object ? (
                  <p className="flex gap-1.5">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>
                      {check?.action} is checked on all{" "}
                      <code>{data.object}</code>, never on a single resource.
                    </span>
                  </p>
                ) : null}
                {data.requires ? (
                  <p className="flex gap-1.5">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>The operation also checks {data.requires}.</span>
                  </p>
                ) : null}
              </div>
            ) : null}

            {deciding.length > 0 ? (
              <RuleSection title="Decides it" rules={deciding} />
            ) : null}

            {notApplying.length > 0 ? (
              <details
                key={`${subject.id}:${check?.action}`}
                open={deciding.length === 0}
                className="group flex flex-col gap-2"
              >
                <summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-gray-700">
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-open:rotate-90" />
                  Rules that don&apos;t apply here ({notApplying.length})
                </summary>
                <div className="mt-2">
                  <RuleSection
                    description={`Rules ${subject.name} holds for ${check?.action} that don't cover this.`}
                    rules={notApplying}
                  />
                </div>
              </details>
            ) : null}

            {rules.length === 0 ? (
              <p className="text-sm text-gray-500">
                No RoleBinding grants {subject.name} {check?.action} on
                anything.
              </p>
            ) : null}
          </>
        ) : null}

        <div className="mt-auto border-t border-gray-100 pt-3 text-xs text-gray-500">
          Access is granted by{" "}
          <Link
            to="/settings/permissions/role-bindings"
            className="text-blue-600 hover:underline"
          >
            Role Bindings
          </Link>
          . This page only reviews it.
        </div>
      </SheetContent>
    </Sheet>
  );
}

function requirementTarget(
  requirement: ReviewRequirement,
  check: AccessCheck | undefined
) {
  if (check?.target && requirement.on === check.target.type) {
    return check.target.name;
  }
  if (requirement.on === "playbook" && check?.resourceLabel) {
    return check.resourceLabel;
  }
  return requirement.on;
}

function Verdict({
  allowed,
  deciding,
  actionLabel,
  refusedBy
}: {
  allowed: boolean;
  deciding: ReviewedRule[];
  actionLabel: string;
  refusedBy: string[];
}) {
  const denies = deciding.filter((rule) => rule.effect === "deny");
  const allows = deciding.filter((rule) => rule.effect === "allow");

  const [title, detail, tone, IconComponent] =
    allowed && refusedBy.length > 0
      ? [
          "Allowed, but the operation is refused",
          `${allows.length} ${allows.length === 1 ? "rule allows" : "rules allow"} it, but the operation also needs ${refusedBy.join(" and ")}, which they don't have.`,
          "border-amber-200 bg-amber-50 text-amber-800",
          Info
        ]
      : allowed
        ? [
            "Allowed",
            `${allows.length} ${allows.length === 1 ? "rule allows" : "rules allow"} it, and no deny binding refuses it.`,
            "border-emerald-200 bg-emerald-50 text-emerald-800",
            Check
          ]
        : denies.length > 0
          ? [
              "Denied",
              `A deny binding refuses it${allows.length > 0 ? `, although ${allows.length === 1 ? "a rule allows" : `${allows.length} rules allow`} it` : ""}. A deny wins over every allow.`,
              "border-red-200 bg-red-50 text-red-800",
              Ban
            ]
          : [
              "Not allowed",
              `No rule allows them to ${actionLabel} this.`,
              "border-gray-200 bg-gray-50 text-gray-800",
              X
            ];

  return (
    <div className={clsx("flex items-start gap-3 rounded-md border p-3", tone)}>
      <IconComponent className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="flex flex-col gap-0.5">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs">{detail}</div>
      </div>
    </div>
  );
}

function RuleSection({
  title,
  description,
  rules
}: {
  title?: string;
  description?: string;
  rules: ReviewedRule[];
}) {
  return (
    <section className="flex flex-col gap-2">
      <div>
        {title ? (
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {title}
          </h4>
        ) : null}
        {description ? (
          <p className="text-xs text-gray-500">{description}</p>
        ) : null}
      </div>
      <ul className="flex flex-col gap-2">
        {rules.map((rule, index) => (
          <li key={index}>
            <RuleCard rule={rule} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function RuleCard({ rule }: { rule: ReviewedRule }) {
  const deny = rule.effect === "deny";

  return (
    <div
      className={clsx(
        "flex flex-col gap-1.5 rounded-md border p-3 text-sm",
        rule.matches
          ? deny
            ? "border-red-200 bg-white"
            : "border-emerald-200 bg-white"
          : "border-dashed border-gray-200 bg-white text-gray-600"
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={clsx(
            "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium",
            deny ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700",
            !rule.matches && "opacity-70"
          )}
        >
          {deny ? (
            <CircleSlash className="h-3 w-3" />
          ) : (
            <Check className="h-3 w-3" />
          )}
          {deny ? "Denies" : "Allows"}
        </span>
        <RuleSource rule={rule} />
        {rule.role_binding?.constrained ? (
          <span
            className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600"
            title="The binding narrows its Role with a constraint"
          >
            constrained
          </span>
        ) : null}
      </div>

      {rule.role ? (
        <div className="text-xs text-gray-600">
          Role{" "}
          <ObjectLink
            to={
              rule.role.id
                ? `/settings/permissions/roles?id=${rule.role.id}`
                : undefined
            }
            label={`${rule.role.namespace}/${rule.role.name}`}
          />
          {rule.rule ? (
            <>
              {", rule "}
              <code className="rounded bg-gray-100 px-1 text-gray-800">
                {rule.rule}
              </code>
            </>
          ) : null}
        </div>
      ) : null}

      <HeldBy rule={rule} />
    </div>
  );
}

function RuleSource({ rule }: { rule: ReviewedRule }) {
  if (rule.hidden) {
    return (
      <span className="text-xs text-gray-500">
        A RoleBinding you can&apos;t read
      </span>
    );
  }

  if (rule.role_binding) {
    return (
      <span className="text-xs">
        <span className="text-gray-500">RoleBinding </span>
        <ObjectLink
          to={`/settings/permissions/role-bindings?id=${rule.role_binding.id}`}
          label={`${rule.role_binding.namespace}/${rule.role_binding.name}`}
        />
      </span>
    );
  }

  if (rule.permission) {
    return (
      <span className="text-xs">
        <span className="text-gray-500">Legacy Permission </span>
        <span className="font-medium text-gray-800">
          {rule.permission.namespace
            ? `${rule.permission.namespace}/${rule.permission.name}`
            : rule.permission.name}
        </span>
      </span>
    );
  }

  return <span className="text-xs text-gray-500">A grant of the policy</span>;
}

function ObjectLink({ to, label }: { to?: string; label: string }) {
  if (!to) {
    return <span className="font-medium text-gray-800">{label}</span>;
  }

  return (
    <Link to={to} className="font-medium text-blue-600 hover:underline">
      {label}
    </Link>
  );
}

function HeldBy({ rule }: { rule: ReviewedRule }) {
  const through = rule.through ?? [];
  if (!rule.direct && through.length === 0) {
    return null;
  }

  const names = through.map((subject) =>
    subject.name
      ? `${subject.type === "team" ? "team " : ""}${subject.name}`
      : `a ${subject.type} you can't read`
  );

  const parts = [
    ...(rule.direct ? ["directly"] : []),
    ...(names.length > 0 ? [`through ${names.join(", ")}`] : [])
  ];

  return (
    <div className="text-xs text-gray-500">Held {parts.join(" and ")}</div>
  );
}
