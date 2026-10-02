import { RoleRule } from "@flanksource-ui/api/types/roles";
import { ScopeTarget } from "@flanksource-ui/api/types/scopes";
import {
  getActionContract,
  getScopeTypes
} from "@flanksource-ui/components/Roles/roleActions";

// What a binding's constraint does to one side (resource or target) of an allow rule,
// following the table in rolebindings.md, Section 3.2.
export type ConstraintSideEffect =
  // The constraint doesn't set this side
  | { kind: "unset" }
  // The rule's action takes no such input, e.g. a target for read
  | { kind: "skipped" }
  // The action takes the input, but the rule omits it: it allows only operations without one
  | { kind: "omitted" }
  // No type the input accepts is selected by both the rule's Scope and the constraint's
  | { kind: "no-common-type" }
  // The input is narrowed to the resources of these types in both Scopes
  | { kind: "narrowed"; types: string[] }
  // A Scope or the action's contract isn't known, so the effect can't be worked out here
  | { kind: "unknown" };

export type RuleConstraintEffect = {
  rule: RoleRule;
  resource: ConstraintSideEffect;
  target: ConstraintSideEffect;
  // Whether the rule applies through the binding; undefined when it can't be worked out here.
  // It's never granted as written: a rule no side narrows doesn't apply either.
  applies: boolean | undefined;
  // Why a rule doesn't apply, when it doesn't
  reason?: string;
};

type ScopeTargetsByName = Record<string, ScopeTarget[] | undefined>;

function sideEffect(
  accepted: string[],
  ruleScope: string | undefined,
  constraintScope: string,
  scopes: ScopeTargetsByName
): ConstraintSideEffect {
  if (!constraintScope) {
    return { kind: "unset" };
  }
  if (accepted.length === 0) {
    return { kind: "skipped" };
  }
  if (!ruleScope) {
    return { kind: "omitted" };
  }

  const ruleTargets = scopes[ruleScope];
  const constraintTargets = scopes[constraintScope];
  if (!ruleTargets || !constraintTargets) {
    return { kind: "unknown" };
  }

  // A type the input can't carry is ignored for that input
  const constraintTypes = getScopeTypes(constraintTargets);
  const types = getScopeTypes(ruleTargets).filter(
    (type) => accepted.includes(type) && constraintTypes.includes(type)
  );
  return types.length > 0
    ? { kind: "narrowed", types }
    : { kind: "no-common-type" };
}

/**
 * Works out, for each allow rule of the Role, what the binding's constraint does to it.
 * It mirrors the spec's rules on types only; the server also checks the requirements of
 * each action (whole-type targets, row-level security) and reports the result.
 */
export function getConstraintEffects(
  rules: RoleRule[],
  constraint: { resource: string; target: string },
  scopes: ScopeTargetsByName
): RuleConstraintEffect[] {
  return rules
    .filter((rule) => !rule.deny)
    .map((rule) => {
      const contract = getActionContract(rule.action);
      if (!contract) {
        return {
          rule,
          resource: { kind: "unknown" },
          target: { kind: "unknown" },
          applies: undefined
        };
      }

      const resource = sideEffect(
        contract.resources,
        rule.resource?.scopeRef,
        constraint.resource,
        scopes
      );
      const target = sideEffect(
        contract.targets,
        rule.target?.scopeRef,
        constraint.target,
        scopes
      );

      const sides = [resource, target];
      if (target.kind === "omitted") {
        return {
          rule,
          resource,
          target,
          applies: false,
          reason: `${rule.action} takes a target, but the rule has none, so it only allows operations without one`
        };
      }
      if (sides.some((side) => side.kind === "no-common-type")) {
        return {
          rule,
          resource,
          target,
          applies: false,
          reason: "The constraint's scope selects no type of the rule's scope"
        };
      }
      if (sides.some((side) => side.kind === "unknown")) {
        return { rule, resource, target, applies: undefined };
      }
      if (!sides.some((side) => side.kind === "narrowed")) {
        return {
          rule,
          resource,
          target,
          applies: false,
          reason: "The constraint narrows it on no side"
        };
      }
      return { rule, resource, target, applies: true };
    });
}
