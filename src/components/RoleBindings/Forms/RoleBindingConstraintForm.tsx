import { useScopesQuery } from "@flanksource-ui/api/query-hooks/useScopesQuery";
import { RoleRule } from "@flanksource-ui/api/types/roles";
import FormikRoleScopeSelect from "@flanksource-ui/components/Roles/Forms/FormikRoleScopeSelect";
import { useFormikContext } from "formik";
import { useMemo } from "react";
import {
  ConstraintSideEffect,
  getConstraintEffects
} from "../constraintEffect";
import { RoleBindingFormValues } from "../roleBindingFormValues";

function SideEffect({ effect }: { effect: ConstraintSideEffect }) {
  switch (effect.kind) {
    case "unset":
      return <span className="text-gray-500">Not narrowed</span>;
    case "skipped":
      return <span className="text-gray-500">Skipped</span>;
    case "omitted":
      return <span className="text-yellow-700">Rule has no target</span>;
    case "no-common-type":
      return <span className="text-yellow-700">No type in common</span>;
    case "narrowed":
      return <span>Narrowed to {effect.types.join(", ")}</span>;
    case "unknown":
      return <span className="text-gray-500">Unknown</span>;
  }
}

// How the constraint narrows each allow rule of the Role, so a rule it can't narrow is seen
// before the binding is saved. The server makes the final call, and reports such rules.
function ConstraintEffects({
  rules,
  namespace
}: {
  rules: RoleRule[];
  namespace?: string;
}) {
  const { values } = useFormikContext<RoleBindingFormValues>();
  const { data: scopes } = useScopesQuery();

  const effects = useMemo(() => {
    // The Role's and the constraint's Scopes are all in the binding's namespace
    const targetsByName = Object.fromEntries(
      (scopes ?? [])
        .filter((scope) => scope.namespace === namespace)
        .map((scope) => [scope.name, scope.targets])
    );
    return getConstraintEffects(rules, values.constraint, targetsByName);
  }, [rules, values.constraint, scopes, namespace]);

  const denyRules = rules.filter((rule) => rule.deny);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        Effect on the role&apos;s rules
      </label>
      <div className="overflow-x-auto rounded-md border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2">Rule</th>
              <th className="px-3 py-2">Resource</th>
              <th className="px-3 py-2">Target</th>
              <th className="px-3 py-2">Applies</th>
            </tr>
          </thead>
          <tbody>
            {effects.map(({ rule, resource, target, applies, reason }) => (
              <tr key={rule.name} className="border-t border-gray-200">
                <td className="px-3 py-2">
                  <div>{rule.name}</div>
                  <div className="font-mono text-xs text-gray-500">
                    {rule.action}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <SideEffect effect={resource} />
                </td>
                <td className="px-3 py-2">
                  <SideEffect effect={target} />
                </td>
                <td className="px-3 py-2">
                  {applies === true && (
                    <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-800">
                      Yes
                    </span>
                  )}
                  {applies === false && (
                    <div className="flex flex-col items-start gap-1">
                      <span className="rounded bg-yellow-100 px-1.5 py-0.5 text-xs text-yellow-800">
                        No
                      </span>
                      <span className="text-xs text-gray-500">{reason}</span>
                    </div>
                  )}
                  {applies === undefined && (
                    <span className="text-xs text-gray-500">Unknown</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">
        A rule that doesn&apos;t apply is never granted as written: the binding
        grants the rest of the role and reports it.
        {denyRules.length > 0 &&
          ` Deny rules are never narrowed and always apply: ${denyRules
            .map((rule) => rule.name)
            .join(", ")}.`}
      </p>
    </div>
  );
}

type RoleBindingConstraintFormProps = {
  // Rules of the bound Role; undefined until a Role that exists is picked
  rules?: RoleRule[];
  namespace?: string;
};

// spec.constraint: one constraint for the whole binding, narrowing every allow rule of the Role
export default function RoleBindingConstraintForm({
  rules,
  namespace
}: RoleBindingConstraintFormProps) {
  const { values } = useFormikContext<RoleBindingFormValues>();
  const isSet = !!values.constraint.resource || !!values.constraint.target;

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="form-label">Constraint</label>
        <p className="text-xs text-gray-500">
          Optional. Limits where the role applies: the resource, or target, of
          every operation the role allows must also be in these scopes. The
          whole role is granted, and deny rules are never narrowed.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-md border border-gray-200 p-4">
        {/* No action contract: a constraint's scope may select types an input can't carry,
            which are ignored for that input */}
        <FormikRoleScopeSelect
          name="constraint.resource"
          label="Resource"
          hint="The resource of every operation must also be in this scope."
          namespace={namespace}
          input="resource"
        />
        <FormikRoleScopeSelect
          name="constraint.target"
          label="Target"
          hint="The target of every operation must also be in this scope. Rules whose action takes no target, like read, skip it."
          namespace={namespace}
          input="target"
        />

        {isSet && rules && rules.length > 0 && (
          <ConstraintEffects rules={rules} namespace={namespace} />
        )}
      </div>
    </div>
  );
}
