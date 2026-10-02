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
import { useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@flanksource-ui/components/ui/dropdown-menu";
import { FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import {
  RoleBindingFormErrors,
  RoleBindingFormValues
} from "../roleBindingFormValues";
import FormikCreatableMultiSelect from "./FormikCreatableMultiSelect";

// The fields of spec.subjects
type SubjectKind =
  | "people"
  | "teams"
  | "roles"
  | "oidc"
  | RoleBindingResourceSubjectKind;

const subjectKinds: { kind: SubjectKind; label: string; hint: string }[] = [
  { kind: "people", label: "People", hint: "Mission Control users, by email." },
  {
    kind: "teams",
    label: "Teams",
    hint: "Every member of the teams, as members join and leave."
  },
  { kind: "roles", label: "Roles", hint: "Everyone with a built-in role." },
  {
    kind: "oidc",
    label: "OIDC",
    hint: "Users of an external identity provider whose token matches a CEL expression over claims, e.g. 'operators' in claims.groups. Use true to match every user."
  },
  { kind: "playbooks", label: "Playbooks", hint: "Playbooks, while they run." },
  {
    kind: "notifications",
    label: "Notifications",
    hint: "Notifications, e.g. reading the resources they report on."
  },
  {
    kind: "topologies",
    label: "Topologies",
    hint: "Topologies, while they run."
  },
  {
    kind: "scrapers",
    label: "Scrapers",
    hint: "Config scrapers, while they run."
  },
  { kind: "canaries", label: "Canaries", hint: "Canaries, while they run." }
];

const builtInRoleDescriptions: Record<string, string> = {
  everyone: "every Mission Control user, guests and agents included",
  guest: "every guest",
  agent: "every agent"
};

function isResourceKind(
  kind: SubjectKind
): kind is RoleBindingResourceSubjectKind {
  return (roleBindingResourceSubjectKinds as readonly string[]).includes(kind);
}

function hasValues(values: RoleBindingFormValues, kind: SubjectKind) {
  return isResourceKind(kind)
    ? values.resourceSubjects[kind].length > 0
    : values[kind].length > 0;
}

function PeopleField() {
  const { data: people, isLoading } = useQuery(
    ["people-roles", undefined],
    async () => (await fetchPeopleWithRoles()).data ?? []
  );

  // People are bound by email
  const options = useMemo(
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

  return (
    <FormikCreatableMultiSelect
      name="people"
      label="People"
      hideLabel
      options={options}
      isLoading={isLoading}
      placeholder="Select people or type an email..."
    />
  );
}

function TeamsField() {
  const { data: teams, isLoading } = useGetAllTeams();

  // Teams are bound by name
  const options = useMemo(
    () => (teams ?? []).map((team) => ({ value: team.name, label: team.name })),
    [teams]
  );

  return (
    <FormikCreatableMultiSelect
      name="teams"
      label="Teams"
      hideLabel
      options={options}
      isLoading={isLoading}
      placeholder="Select teams..."
    />
  );
}

function RolesField() {
  const { values, setFieldValue } = useFormikContext<RoleBindingFormValues>();

  return (
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
          <span className="text-gray-500">{builtInRoleDescriptions[role]}</span>
        </label>
      ))}
    </div>
  );
}

function OIDCField() {
  const { values } = useFormikContext<RoleBindingFormValues>();

  return (
    <FieldArray name="oidc">
      {({ push, remove }) => (
        <div className="flex flex-col gap-2">
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

  return (
    <FieldArray name={`resourceSubjects.${kind}`}>
      {({ push, remove }) => (
        <div className="flex flex-col gap-2">
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
                placeholder="Name, or * for any"
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

function SubjectField({ kind }: { kind: SubjectKind }) {
  switch (kind) {
    case "people":
      return <PeopleField />;
    case "teams":
      return <TeamsField />;
    case "roles":
      return <RolesField />;
    case "oidc":
      return <OIDCField />;
    default:
      return <ResourceSubjectField kind={kind} />;
  }
}

// Lists the kinds of subject not shown yet. The menu is portalled to the body, so the
// modal's scrolling body doesn't clip it.
function AddSubjectMenu({
  kinds,
  onAdd
}: {
  kinds: typeof subjectKinds;
  onAdd: (kind: SubjectKind) => void;
}) {
  if (kinds.length === 0) {
    return null;
  }

  return (
    // Not modal: a modal menu would lock the dialog it opens from
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <div>
          <Button text="Add subject" icon={<FaPlus />} className="btn-white" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 bg-white">
        {/* Labels only, to keep the menu short; each section shows its description */}
        {kinds.map(({ kind, label }) => (
          <DropdownMenuItem
            key={kind}
            className="cursor-pointer text-sm text-gray-700"
            onSelect={() => onAdd(kind)}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function RoleBindingSubjectsForm() {
  const { values, errors, submitCount, setFieldValue } =
    useFormikContext<RoleBindingFormValues>();
  // Set by validateRoleBindingForm; not a field of the form
  const subjectsError = (errors as RoleBindingFormErrors).subjects;

  // Only the kinds of subject the binding uses, or that were just added, are shown
  const [shown, setShown] = useState<SubjectKind[]>(() =>
    subjectKinds
      .filter(({ kind }) => hasValues(values, kind))
      .map(({ kind }) => kind)
  );

  const add = (kind: SubjectKind) => {
    setShown([...shown, kind]);
    // Lists of objects start with an empty entry to fill in
    if (kind === "oidc") {
      setFieldValue("oidc", [{ provider: "", match: "" }]);
    } else if (isResourceKind(kind)) {
      setFieldValue(`resourceSubjects.${kind}`, [{ namespace: "", name: "" }]);
    }
  };

  const remove = (kind: SubjectKind) => {
    setShown(shown.filter((item) => item !== kind));
    setFieldValue(isResourceKind(kind) ? `resourceSubjects.${kind}` : kind, []);
  };

  const shownKinds = subjectKinds.filter(({ kind }) => shown.includes(kind));

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="form-label">
          Subjects <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500">
          Who gets the role. Someone matched more than once gets it once.
        </p>
      </div>

      {shownKinds.length > 0 && (
        <div className="flex flex-col divide-y divide-gray-200 rounded-md border border-gray-200">
          {shownKinds.map(({ kind, label, hint }) => (
            <div key={kind} className="flex flex-col gap-2 p-3">
              <div className="flex flex-row items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    {label}
                  </div>
                  <p className="text-xs text-gray-500">{hint}</p>
                </div>
                <button
                  type="button"
                  className="p-1 text-gray-500 hover:text-red-600"
                  title={`Remove ${label.toLowerCase()}`}
                  onClick={() => remove(kind)}
                >
                  <FaTimes />
                </button>
              </div>
              <SubjectField kind={kind} />
            </div>
          ))}
        </div>
      )}

      <AddSubjectMenu
        kinds={subjectKinds.filter(({ kind }) => !shown.includes(kind))}
        onAdd={add}
      />

      {submitCount > 0 && subjectsError && (
        <p className="text-sm text-red-500">{subjectsError}</p>
      )}
    </div>
  );
}
