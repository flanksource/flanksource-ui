import { getServiceAccountNames } from "@flanksource-ui/api/services/serviceAccounts";
import { getTeams } from "@flanksource-ui/api/services/teams";
import { getHumanPeople } from "@flanksource-ui/api/services/users";
import {
  RoleBindingNamedSubject,
  roleBindingSubjectParams
} from "@flanksource-ui/api/types/roleBindings";
import {
  GroupByOptions,
  MultiSelectDropdown
} from "@flanksource-ui/ui/Dropdowns/MultiSelectDropdown";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

type SubjectField = RoleBindingNamedSubject["field"];

const subjectKinds: { field: SubjectField; label: string }[] = [
  { field: "people", label: "Person" },
  { field: "teams", label: "Team" },
  { field: "serviceAccounts", label: "Service account" }
];

const anyKind: GroupByOptions = { value: "", label: "Any" };

// The values a binding names each kind of subject by: emails, team names and service account names
async function subjectOptions(field: SubjectField): Promise<GroupByOptions[]> {
  switch (field) {
    case "people":
      return ((await getHumanPeople()).data ?? [])
        .filter((person) => person.email)
        .map((person) => ({
          value: person.email,
          label: `${person.name} (${person.email})`
        }));
    case "teams":
      return (await getTeams()).map(({ name }) => ({
        value: name,
        label: name
      }));
    case "serviceAccounts":
      return (await getServiceAccountNames()).map((name) => ({
        value: name,
        label: name
      }));
  }
}

/**
 * Filters role bindings by a subject they name, kept in the person, team or
 * serviceAccount search param. It doesn't expand "*", emails or provider
 * entries: who a binding applies to is for Check Access.
 */
export function useRoleBindingSubjectFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const subject = useMemo<RoleBindingNamedSubject | undefined>(() => {
    for (const { field } of subjectKinds) {
      const name = searchParams.get(roleBindingSubjectParams[field]);
      if (name) {
        return { field, name };
      }
    }
    return undefined;
  }, [searchParams]);

  // A kind picked before its subject isn't in the URL until the subject is
  const [pickedField, setPickedField] = useState<SubjectField>();
  const field = subject?.field ?? pickedField;
  const kind = subjectKinds.find((item) => item.field === field);

  const { data: options = [], isLoading } = useQuery({
    queryKey: ["role-bindings", "subject-options", field],
    queryFn: () => subjectOptions(field!),
    enabled: !!field
  });

  const setSubject = (next?: RoleBindingNamedSubject) =>
    setSearchParams((params) => {
      Object.values(roleBindingSubjectParams).forEach((param) =>
        params.delete(param)
      );
      if (next) {
        params.set(roleBindingSubjectParams[next.field], next.name);
      }
      return params;
    });

  // A subject from a link stays listed when it isn't an option, e.g. a service account not created yet
  const selected = subject
    ? (options.find((option) => option.value === subject.name) ?? {
        value: subject.name,
        label: subject.name
      })
    : { value: "", label: `Select a ${kind?.label.toLowerCase()}` };

  const subjectFilter = (
    <>
      <MultiSelectDropdown
        label="Subject type"
        isMulti={false}
        isClearable={false}
        closeMenuOnSelect
        options={[
          anyKind,
          ...subjectKinds.map(({ field, label }) => ({ value: field, label }))
        ]}
        value={kind ? { value: kind.field, label: kind.label } : anyKind}
        onChange={(option: unknown) => {
          const next = ((option as GroupByOptions | null)?.value ||
            undefined) as SubjectField | undefined;
          if (next !== field) {
            setPickedField(next);
            setSubject(undefined);
          }
        }}
        minMenuWidth="200px"
        dropDownClassNames="w-auto min-w-[200px]"
      />
      {kind && (
        <MultiSelectDropdown
          label="Names this subject"
          isMulti={false}
          closeMenuOnSelect
          isLoading={isLoading}
          options={options}
          value={selected}
          onChange={(option: unknown) => {
            const name = (option as GroupByOptions | null)?.value;
            setSubject(name ? { field: kind.field, name } : undefined);
          }}
          minMenuWidth="300px"
          dropDownClassNames="w-auto min-w-[300px]"
        />
      )}
    </>
  );

  const subjectNote = subject && (
    <p className="text-sm text-gray-500">
      Role bindings that list {subject.name} in {subject.field}, not the ones
      that apply to it some other way;{" "}
      <Link
        to="/settings/permissions/check-access"
        className="text-blue-600 hover:underline"
      >
        Check Access
      </Link>{" "}
      shows who a binding applies to.
    </p>
  );

  return { subject, subjectFilter, subjectNote };
}
