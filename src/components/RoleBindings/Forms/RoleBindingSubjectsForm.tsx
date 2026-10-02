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

const resourceSubjectLabels: Record<RoleBindingResourceSubjectKind, string> = {
  playbooks: "Playbooks",
  notifications: "Notifications",
  topologies: "Topologies",
  scrapers: "Scrapers",
  canaries: "Canaries"
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
      <label className="text-sm font-medium text-gray-700">
        Built-in roles
      </label>
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
          <label className="text-sm font-medium text-gray-700">
            External identity provider users
          </label>
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
              text="Add provider users"
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

function ResourceSubjects() {
  const { values } = useFormikContext<RoleBindingFormValues>();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">Resources</label>
      <p className="text-xs text-gray-500">
        Resources acting on their own, e.g. a playbook calling Mission Control
        while it runs. Set a name (or <code>*</code> for any), a namespace
        (empty for any), or both.
      </p>
      {roleBindingResourceSubjectKinds.map((kind) => (
        <FieldArray key={kind} name={`resourceSubjects.${kind}`}>
          {({ remove }) => (
            <div className="flex flex-col gap-2">
              {values.resourceSubjects[kind].map((_, index) => (
                <div key={index} className="flex flex-row items-start gap-2">
                  <span className="mt-7 w-28 text-sm text-gray-700">
                    {resourceSubjectLabels[kind]}
                  </span>
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
            </div>
          )}
        </FieldArray>
      ))}
      <AddResourceSubjectButtons />
    </div>
  );
}

function AddResourceSubjectButtons() {
  const { values, setFieldValue } = useFormikContext<RoleBindingFormValues>();

  return (
    <div className="flex flex-wrap gap-2">
      {roleBindingResourceSubjectKinds.map((kind) => (
        <Button
          key={kind}
          text={resourceSubjectLabels[kind]}
          icon={<FaPlus />}
          className="btn-white btn-sm"
          onClick={() => {
            setFieldValue(`resourceSubjects.${kind}`, [
              ...values.resourceSubjects[kind],
              { namespace: "", name: "" }
            ]);
          }}
        />
      ))}
    </div>
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
      <ResourceSubjects />
      {submitCount > 0 && subjectsError && (
        <p className="text-sm text-red-500">{subjectsError}</p>
      )}
    </div>
  );
}
