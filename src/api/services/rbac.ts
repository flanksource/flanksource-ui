import { Rback } from "../axios";

export type Permission = {
  subject: string;
  object: string;
  action: string;
  deny?: boolean;
  condition?: string;
  id?: string;
};

export type PermissionsResponse = {
  message: string;
  payload: Permission[];
};

export function permissionHash(p: Permission): string {
  return `sub=${p.subject},obj=${p.object},act=${p.action},d=${p.deny ?? false},con=${p.condition ?? ""},id=${p.id ?? ""}`;
}

export function permissionFromHash(hash: string): Permission {
  const pairs = hash.split(",");
  const permission: Partial<Permission> = {};

  pairs.forEach((pair) => {
    const [key, value] = pair.split("=");
    switch (key) {
      case "sub":
        permission.subject = value;
        break;
      case "obj":
        permission.object = value;
        break;
      case "act":
        permission.action = value;
        break;
      case "d":
        permission.deny = value === "true";
        break;
      case "con":
        permission.condition = value || undefined;
        break;
      case "id":
        permission.id = value || undefined;
        break;
    }
  });
  return permission as Permission;
}

export async function getPermissions(id: string): Promise<Permission[]> {
  const response = await Rback.get<PermissionsResponse>(
    `/token/${id}/permissions`
  );
  return response.data.payload ?? [];
}

export type SubjectAccessReviewResource = {
  playbook?: string;
  view?: string;
  connection?: string;
  config?: string;
  component?: string;
  check?: string;
  global?: string;
};

// A resource an action that takes a target is checked on, e.g. the config a playbook runs on.
export type SubjectAccessReviewTarget = Pick<
  SubjectAccessReviewResource,
  "config" | "component" | "check"
>;

export type SubjectAccessReviewAction =
  | "read"
  | "create"
  | "update"
  | "delete"
  | "mcp:run"
  | "mcp:use"
  | "connection:use"
  | "person:manage"
  | "access:review"
  | "property:manage"
  | "event:read"
  | "job:read"
  | `invoke:${string}:${string}`
  | "playbook:run"
  | "playbook:cancel"
  | "playbook:approve";

export type SubjectAccessReviewRequest = {
  resource: SubjectAccessReviewResource;
  action: SubjectAccessReviewAction;
  subjects: string[];
  explain?: boolean;
};

export type RBACObjectRef = {
  id?: string;
  namespace: string;
  name: string;
};

export type ReviewSubjectRef = {
  id?: string;
  type: "team" | "plugin" | "other";
  name?: string;
};

// A rule a subject holds for the reviewed action, and how it holds it.
export type ReviewedRule = {
  effect: "allow" | "deny";
  // Whether the rule matches the check. One that doesn't is for the action, but not for this resource.
  matches: boolean;
  role_binding?: RBACObjectRef & { constrained?: boolean };
  role?: RBACObjectRef;
  rule?: string;
  // A legacy Permission that grants the rule.
  permission?: RBACObjectRef;
  direct?: boolean;
  through?: ReviewSubjectRef[];
  // Why a rule that doesn't match doesn't.
  reason?: string;
  // Set when the reviewer may not read what grants the rule.
  hidden?: boolean;
};

// Another check an operation makes besides its action, e.g. read on a run's target.
export type ReviewRequirement = {
  action: string;
  // The resource type, or the RBAC object, it's checked on.
  on: string;
  allowed: boolean;
};

export type SubjectAccessReviewResult = {
  subject: string;
  // Whether the action itself is allowed. An operation also needs its requirements.
  allowed: boolean;
  error?: string;
  rules?: ReviewedRule[];
  requirements?: ReviewRequirement[];
};

export type SubjectAccessReviewResponse = {
  resource: SubjectAccessReviewResource;
  action: SubjectAccessReviewAction;
  // The RBAC object the action was checked on, when it's checked on a whole type rather than the resource.
  object?: string;
  // What an operation checks besides the action, e.g. read on the target.
  requires?: string;
  results: SubjectAccessReviewResult[];
};

export async function reviewSubjectAccess(
  payload: SubjectAccessReviewRequest
): Promise<SubjectAccessReviewResponse> {
  const response = await Rback.post<SubjectAccessReviewResponse>(
    "/subject-access-reviews",
    payload
  );

  return response.data;
}

export type EffectiveSubjectResourceAccessResource = {
  id: string;
  type: "playbook" | "view" | "connection" | "plugin";
};

export type EffectiveSubjectResourceAccessRequest = {
  subject: string;
  action: SubjectAccessReviewAction;
  resources: EffectiveSubjectResourceAccessResource[];
  target?: SubjectAccessReviewTarget;
};

export type EffectiveSubjectResourceAccessResult = {
  resourceId: string;
  resourceType: "playbook" | "view" | "connection" | "plugin";
  allowed: boolean;
};

export type EffectiveSubjectResourceAccessResponse = {
  subject: string;
  action: SubjectAccessReviewAction;
  results: EffectiveSubjectResourceAccessResult[];
};

type SubjectAccessSearchRequest = {
  subject: string;
  action: SubjectAccessReviewAction;
  resource_types?: Array<"playbook" | "view" | "connection">;
  target?: SubjectAccessReviewTarget;
};

type SubjectAccessSearchResponse = {
  subject: string;
  action: SubjectAccessReviewAction;
  resource_types: Array<"playbook" | "view" | "connection">;
  target?: SubjectAccessReviewTarget;
  total: number;
  results: Array<{
    resource_type: "playbook" | "view" | "connection";
    id: string;
  }>;
};

export async function fetchEffectiveSubjectResourceAccess(
  payload: EffectiveSubjectResourceAccessRequest
): Promise<EffectiveSubjectResourceAccessResponse> {
  const resourceTypes = Array.from(
    new Set(payload.resources.map((resource) => resource.type))
  ).filter(
    (type): type is "playbook" | "view" | "connection" => type !== "plugin"
  );

  const allowedResourceKeys = new Set<string>();

  const response = await Rback.post<SubjectAccessSearchResponse>(
    "/subject-access-search",
    {
      subject: payload.subject,
      action: payload.action,
      resource_types: resourceTypes,
      target: payload.target
    } satisfies SubjectAccessSearchRequest
  );

  const data = response.data;

  for (const result of data.results ?? []) {
    allowedResourceKeys.add(`${result.resource_type}:${result.id}`);
  }

  return {
    subject: payload.subject,
    action: payload.action,
    results: payload.resources.map((resource) => ({
      resourceId: resource.id,
      resourceType: resource.type,
      allowed: allowedResourceKeys.has(`${resource.type}:${resource.id}`)
    }))
  };
}

export type EffectiveResourceSubjectAccessRequest = {
  resource: EffectiveSubjectResourceAccessResource;
  action: SubjectAccessReviewAction;
  subjects: string[];
};

export type EffectiveResourceSubjectAccessResult = {
  subjectId: string;
  allowed: boolean;
};

export type EffectiveResourceSubjectAccessResponse = {
  resource: EffectiveSubjectResourceAccessResource;
  action: SubjectAccessReviewAction;
  results: EffectiveResourceSubjectAccessResult[];
};

export async function fetchEffectiveResourceSubjectAccess(
  payload: EffectiveResourceSubjectAccessRequest
): Promise<EffectiveResourceSubjectAccessResponse> {
  const resource: SubjectAccessReviewResource =
    payload.resource.type === "playbook"
      ? { playbook: payload.resource.id }
      : payload.resource.type === "view"
        ? { view: payload.resource.id }
        : { connection: payload.resource.id };

  const response = await reviewSubjectAccess({
    resource,
    action: payload.action,
    subjects: ["*"]
  });

  const allowedBySubject = new Map(
    (response.results ?? []).map((result) => [result.subject, result.allowed])
  );

  return {
    resource: payload.resource,
    action: payload.action,
    results: payload.subjects.map((subjectId) => ({
      subjectId,
      allowed: allowedBySubject.get(subjectId) === true
    }))
  };
}
