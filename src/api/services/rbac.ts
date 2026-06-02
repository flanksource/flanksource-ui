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
  plugin?: string;
  config?: string;
  check?: string;
  global?: string;
  [key: string]: string | undefined;
};

export type SubjectAccessReviewAction =
  | "read"
  | "update"
  | "delete"
  | "mcp:run"
  | "mcp:use"
  | `invoke:${string}:*`
  | `invoke:${string}:${string}`
  | "playbook:run"
  | "playbook:cancel"
  | "playbook:approve";

export type SubjectAccessReviewRequest = {
  resource: SubjectAccessReviewResource;
  action: SubjectAccessReviewAction;
  subjects: string[];
};

export type SubjectAccessReviewMatchedPolicy = {
  subject: string;
  object: string;
  action: string;
  effect: "allow" | "deny";
  condition?: string;
  id?: string;
};

export type SubjectAccessReviewResult = {
  subject: string;
  allowed: boolean;
  reason?: string;
  trace?: {
    allow_count: number;
    deny_count: number;
    matched_policies: SubjectAccessReviewMatchedPolicy[];
  };
  error?: string;
};

export type SubjectAccessReviewResponse = {
  resource: SubjectAccessReviewResource;
  action: SubjectAccessReviewAction;
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
  resource_types?: Array<"playbook" | "view" | "connection" | "plugin">;
  search?: string;
  namespace?: string;
};

type SubjectAccessSearchResponse = {
  subject: string;
  action: SubjectAccessReviewAction;
  resource_types: Array<"playbook" | "view" | "connection" | "plugin">;
  total: number;
  limit: number;
  offset: number;
  results: Array<{
    resource_type: "playbook" | "view" | "connection";
    id: string;
    name: string;
    namespace?: string;
  }>;
};

export async function fetchEffectiveSubjectResourceAccess(
  payload: EffectiveSubjectResourceAccessRequest
): Promise<EffectiveSubjectResourceAccessResponse> {
  const resourceTypes = Array.from(
    new Set(payload.resources.map((resource) => resource.type))
  );

  const allowedResourceKeys = new Set<string>();

  const response = await Rback.post<SubjectAccessSearchResponse>(
    "/subject-access-search",
    {
      subject: payload.subject,
      action: payload.action,
      resource_types: resourceTypes
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
