import {
  RoleBindingConstraint,
  RoleBindingDisplay,
  RoleBindingResourceSubject,
  RoleBindingResourceSubjectKind,
  RoleBindingSpec,
  RoleBindingSubjects,
  roleBindingResourceSubjectKinds
} from "@flanksource-ui/api/types/roleBindings";
import { RoleRule } from "@flanksource-ui/api/types/roles";

export type ConstraintFormValues = {
  rule: string;
  // Whether the binding grants the rule. Only used when constraintMode is "selected".
  include: boolean;
  // Scopes, in the binding's namespace, that narrow the rule's resource and target
  resource: string;
  target: string;
};

export type ResourceSubjectFormValues = {
  namespace: string;
  name: string;
};

export type RoleBindingFormValues = {
  name: string;
  // The namespace of the Role: a binding can only grant a Role in its own namespace
  namespace?: string;
  description: string;
  role: string;
  people: string[];
  teams: string[];
  roles: string[];
  oidc: { provider: string; match: string }[];
  resourceSubjects: Record<
    RoleBindingResourceSubjectKind,
    ResourceSubjectFormValues[]
  >;
  // "all" grants every rule of the Role as written. "selected" grants only the included
  // allow rules, so a rule added to the Role later isn't granted until it's included here.
  constraintMode: "all" | "selected";
  constraints: ConstraintFormValues[];
};

const dnsSubdomain =
  /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
const email = /^[^\s@<>]+@[^\s@<>]+$/;
const pattern = /[*!,]/;

function emptyResourceSubjects(): RoleBindingFormValues["resourceSubjects"] {
  return Object.fromEntries(
    roleBindingResourceSubjectKinds.map((kind) => [kind, []])
  ) as unknown as RoleBindingFormValues["resourceSubjects"];
}

export function roleBindingToFormValues(
  binding?: RoleBindingDisplay
): RoleBindingFormValues {
  const subjects = binding?.subjects ?? {};
  const constraints = binding?.constraints ?? [];
  const resourceSubjects = emptyResourceSubjects();
  roleBindingResourceSubjectKinds.forEach((kind) => {
    resourceSubjects[kind] = (subjects[kind] ?? []).map((subject) => ({
      namespace: subject.namespace ?? "",
      name: subject.name ?? ""
    }));
  });

  return {
    name: binding?.name ?? "",
    namespace: binding?.namespace ?? undefined,
    description: binding?.description ?? "",
    role: binding?.role ?? "",
    people: subjects.people ?? [],
    teams: subjects.teams ?? [],
    roles: subjects.roles ?? [],
    oidc: (subjects.oidc ?? []).map((subject) => ({ ...subject })),
    resourceSubjects,
    constraintMode: constraints.length > 0 ? "selected" : "all",
    constraints: constraints.map((constraint) => ({
      rule: constraint.rule,
      include: true,
      resource: constraint.resource?.scopeRef ?? "",
      target: constraint.target?.scopeRef ?? ""
    }))
  };
}

/**
 * Lists a constraint for every allow rule of the Role, keeping what's already set.
 * Constraints on rules the Role no longer has are kept, so they can be seen and removed.
 */
export function syncConstraintsWithRole(
  constraints: ConstraintFormValues[],
  rules: RoleRule[]
): ConstraintFormValues[] {
  const allowRules = rules.filter((rule) => !rule.deny);
  const fromRole = allowRules.map(
    (rule) =>
      constraints.find((constraint) => constraint.rule === rule.name) ?? {
        rule: rule.name,
        include: false,
        resource: "",
        target: ""
      }
  );
  const stale = constraints.filter(
    (constraint) => !allowRules.some((rule) => rule.name === constraint.rule)
  );
  return [...fromRole, ...stale];
}

function nonEmpty<T>(values: T[]): T[] | undefined {
  return values.length > 0 ? values : undefined;
}

export function formValuesToSubjects(
  values: RoleBindingFormValues
): RoleBindingSubjects {
  const subjects: RoleBindingSubjects = {
    people: nonEmpty(values.people),
    teams: nonEmpty(values.teams),
    roles: nonEmpty(values.roles),
    oidc: nonEmpty(
      values.oidc.map((subject) => ({
        provider: subject.provider.trim(),
        match: subject.match.trim()
      }))
    )
  };

  roleBindingResourceSubjectKinds.forEach((kind) => {
    subjects[kind] = nonEmpty(
      values.resourceSubjects[kind].map((subject) => {
        const selector: RoleBindingResourceSubject = {};
        if (subject.namespace.trim()) {
          selector.namespace = subject.namespace.trim();
        }
        if (subject.name.trim()) {
          selector.name = subject.name.trim();
        }
        return selector;
      })
    );
  });

  // Unset fields are dropped, as the API's
  return Object.fromEntries(
    Object.entries(subjects).filter(([, value]) => value !== undefined)
  );
}

export function formValuesToConstraints(
  values: RoleBindingFormValues
): RoleBindingConstraint[] | undefined {
  if (values.constraintMode === "all") {
    return undefined;
  }

  return values.constraints
    .filter((constraint) => constraint.include)
    .map((constraint) => ({
      rule: constraint.rule,
      ...(constraint.resource
        ? { resource: { scopeRef: constraint.resource } }
        : {}),
      ...(constraint.target ? { target: { scopeRef: constraint.target } } : {})
    }));
}

export function formValuesToSpec(
  values: RoleBindingFormValues
): RoleBindingSpec {
  const constraints = formValuesToConstraints(values);
  return {
    ...(values.description.trim()
      ? { description: values.description.trim() }
      : {}),
    role: values.role,
    subjects: formValuesToSubjects(values),
    ...(constraints ? { constraints } : {})
  };
}

export type RoleBindingFormErrors = {
  name?: string;
  role?: string;
  subjects?: string;
  people?: string;
  oidc?: ({ provider?: string; match?: string } | undefined)[];
  resourceSubjects?: Partial<
    Record<
      RoleBindingResourceSubjectKind,
      ({ namespace?: string; name?: string } | undefined)[]
    >
  >;
  constraints?: string;
};

// Checks what the API rejects on its own, apart from compiling the CEL in oidc.match.
// What depends on the Role and Scopes is stored by the API and reported as not in effect.
export function validateRoleBindingForm(
  values: RoleBindingFormValues
): RoleBindingFormErrors {
  const errors: RoleBindingFormErrors = {};

  if (!values.name) {
    errors.name = "Name is required";
  } else if (values.name.length > 253 || !dnsSubdomain.test(values.name)) {
    errors.name =
      "Use lowercase letters, numbers, '-' and '.', starting and ending with a letter or number";
  }

  if (!values.role) {
    errors.role = "Role is required";
  }

  const subjects = formValuesToSubjects(values);
  if (Object.keys(subjects).length === 0) {
    errors.subjects = "At least one subject is required";
  }

  const invalidPerson = values.people.find((person) => !email.test(person));
  if (invalidPerson) {
    errors.people = `${invalidPerson} isn't an email address`;
  }

  const oidcErrors = values.oidc.map((subject) => {
    const e: { provider?: string; match?: string } = {};
    if (!subject.provider.trim()) {
      e.provider = "Provider is required";
    }
    if (!subject.match.trim()) {
      e.match = 'Match is required; use "true" to match every user';
    }
    return Object.keys(e).length > 0 ? e : undefined;
  });
  if (oidcErrors.some(Boolean)) {
    errors.oidc = oidcErrors;
  }

  roleBindingResourceSubjectKinds.forEach((kind) => {
    const kindErrors = values.resourceSubjects[kind].map((subject) => {
      const namespace = subject.namespace.trim();
      const name = subject.name.trim();
      const e: { namespace?: string; name?: string } = {};
      if (!namespace && !name) {
        e.name = "Set a name, a namespace, or both";
      }
      if (name !== "*" && pattern.test(name)) {
        e.name = 'Use an exact name, or "*" for any name';
      }
      if (pattern.test(namespace)) {
        e.namespace = "Use an exact namespace; leave it empty for any";
      }
      return Object.keys(e).length > 0 ? e : undefined;
    });
    if (kindErrors.some(Boolean)) {
      errors.resourceSubjects = {
        ...errors.resourceSubjects,
        [kind]: kindErrors
      };
    }
  });

  // An empty list of constraints grants every rule, the opposite of what "selected" means
  if (
    values.constraintMode === "selected" &&
    !values.constraints.some((constraint) => constraint.include)
  ) {
    errors.constraints = "Select at least one rule to grant";
  }

  return errors;
}
