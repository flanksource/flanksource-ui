import { useGetAllTeams } from "@flanksource-ui/api/query-hooks/responders";
import {
  RoleBindingResourceSubjectKind,
  bindableBuiltInRoles,
  roleBindingResourceSubjectKinds
} from "@flanksource-ui/api/types/roleBindings";
import { fetchPeopleWithRoles } from "@flanksource-ui/api/services/users";
import FormikTextInput from "@flanksource-ui/components/Forms/Formik/FormikTextInput";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { useQuery } from "@tanstack/react-query";
import { FieldArray, useFormikContext } from "formik";
import { useMemo } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import {
  RoleBindingFormErrors,
  RoleBindingFormValues
} from "../roleBindingFormValues";
import FormikCreatableMultiSelect from "./FormikCreatableMultiSelect";

const builtInRoleDescriptions: Record<string, string> = {
  everyone: "Every Mission Control user, guests and agents included",
  guest: "Every guest",
  agent: "Every agent"
};

// Labelled by their field in spec.subjects
const resourceSubjectFields: Record<
  RoleBindingResourceSubjectKind,
  { label: string; hint: string }
> = {
  playbooks: { label: "Playbooks", hint: "Playbooks, while they run." },
  notifications: {
    label: "Notifications",
    hint: "Notifications, e.g. reading the resources they report on."
  },
  topologies: { label: "Topologies", hint: "Topologies, while they run." },
  scrapers: { label: "Scrapers", hint: "Config scrapers, while they run." },
  canaries: { label: "Canaries", hint: "Canaries, while they run." }
};

function PeopleAndTeams() {
  const { data: people, isLoading: isLoadingPeople } = useQuery(
    ["people-roles", undefined],
    async () => (await fetchPeopleWithRoles()).data ?? []
  );
  const { data: teams, isLoading: isLoadingTeams } = useGetAllTeams();

  // People are bound by email, teams by name
  const peopleOptions = useMemo(
    () =>
      (people ?? [])
        .filter((person) => person.email)
        .map((person) => ({
          value: person.email,
          label: person.name || person.email,
          description: person.email
        })),
    [people]
  );

  const teamOptions = useMemo(
    () => (teams ?? []).map((team) => ({ value: team.name, label: team.name })),
    [teams]
  );

  return (
    <>
      <FormikCreatableMultiSelect
        name="people"
        label="People"
        hint="Mission Control users, by email."
        options={peopleOptions}
        isLoading={isLoadingPeople}
        placeholder="Select people or type an email..."
      />
      <FormikCreatableMultiSelect
        name="teams"
        label="Teams"
        hint="Every member of the teams, as members join and leave."
        options={teamOptions}
        isLoading={isLoadingTeams}
        placeholder="Select teams..."
      />
    </>
  );
}

function BuiltInRoles() {
  const { values, setFieldValue } = useFormikContext<RoleBindingFormValues>();

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Roles</label>
      <p className="text-xs text-gray-500">Everyone with a built-in role.</p>
      <div className="flex flex-col gap-1">
        {bindableBuiltInRoles.map((role) => (
          <label key={role} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={values.roles.includes(role)}
              onChange={(event) =>
                setFieldValue(
                  "roles",
                  event.target.checked
                    ? [...values.roles, role]
                    : values.roles.filter((item) => item !== role)
                )
              }
            />
            <span className="font-medium">{role}</span>
            <span className="text-gray-500">
              {builtInRoleDescriptions[role]}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function OIDCSubjects() {
  const { values } = useFormikContext<RoleBindingFormValues>();

  return (
    <FieldArray name="oidc">
      {({ push, remove }) => (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">OIDC</label>
          <p className="text-xs text-gray-500">
            Users of an ExternalIdentityProvider whose token matches a CEL
            expression over <code>claims</code>, e.g.{" "}
            <code>
              &apos;operators&apos; in claims.groups &amp;&amp; claims.tenant ==
              &apos;a&apos;
            </code>
            . Use <code>true</code> to match every user of the provider.
          </p>
          {values.oidc.map((_, index) => (
            <div key={index} className="flex flex-row items-start gap-2">
              <FormikTextInput
                name={`oidc.${index}.provider`}
                label="Provider"
                placeholder="Provider name"
                className="flex w-1/3 flex-col"
              />
              <FormikTextInput
                name={`oidc.${index}.match`}
                label="Match"
                placeholder="claims.tenant == 'a'"
                className="flex flex-1 flex-col"
                inputClassName="font-mono"
              />
              <button
                type="button"
                className="mt-7 p-1 text-gray-500 hover:text-red-600"
                title="Remove"
                onClick={() => remove(index)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <div>
            <Button
              text="Add"
              icon={<FaPlus />}
              className="btn-white btn-sm"
              onClick={() => push({ provider: "", match: "" })}
            />
          </div>
        </div>
      )}
    </FieldArray>
  );
}

// Each entry selects by namespace and/or name: name is exact or "*", an empty namespace matches any
function ResourceSubjectField({
  kind
}: {
  kind: RoleBindingResourceSubjectKind;
}) {
  const { values } = useFormikContext<RoleBindingFormValues>();
  const { label, hint } = resourceSubjectFields[kind];

  return (
    <FieldArray name={`resourceSubjects.${kind}`}>
      {({ push, remove }) => (
        <div className="flex flex-col gap-2">
          <div>
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <p className="text-xs text-gray-500">
              {hint} Set a name (<code>*</code> for any), a namespace (empty for
              any), or both.
            </p>
          </div>
          {values.resourceSubjects[kind].map((_, index) => (
            <div key={index} className="flex flex-row items-start gap-2">
              <FormikTextInput
                name={`resourceSubjects.${kind}.${index}.namespace`}
                label="Namespace"
                placeholder="Any namespace"
                className="flex flex-1 flex-col"
              />
              <FormikTextInput
                name={`resourceSubjects.${kind}.${index}.name`}
                label="Name"
                placeholder="Name or *"
                className="flex flex-1 flex-col"
              />
              <button
                type="button"
                className="mt-7 p-1 text-gray-500 hover:text-red-600"
                title="Remove"
                onClick={() => remove(index)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <div>
            <Button
              text="Add"
              icon={<FaPlus />}
              className="btn-white btn-sm"
              onClick={() => push({ namespace: "", name: "" })}
            />
          </div>
        </div>
      )}
    </FieldArray>
  );
}

export default function RoleBindingSubjectsForm() {
  const { errors, submitCount } = useFormikContext<RoleBindingFormValues>();
  // Set by validateRoleBindingForm; not a field of the form
  const subjectsError = (errors as RoleBindingFormErrors).subjects;

  return (
    <div className="flex flex-col gap-4 rounded-md border border-gray-200 p-4">
      <div>
        <label className="form-label">Subjects</label>
        <p className="text-xs text-gray-500">
          Who gets the role. Someone matched more than once gets it once.
        </p>
      </div>
      <PeopleAndTeams />
      <BuiltInRoles />
      <OIDCSubjects />
      {roleBindingResourceSubjectKinds.map((kind) => (
        <ResourceSubjectField key={kind} kind={kind} />
      ))}
      {submitCount > 0 && subjectsError && (
        <p className="text-sm text-red-500">{subjectsError}</p>
      )}
    </div>
  );
}
