import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import FormikPeopleDropdown from "@flanksource-ui/components/Forms/Formik/FormikPeopleDropdown";
import FormikTeamsDropdown from "@flanksource-ui/components/Forms/Formik/FormikTeamsDropdown";
import { useFormikContext } from "formik";
import { useState, useEffect } from "react";

type AccessScopeSubjectControlsProps = {
  disabled?: boolean;
};

export default function AccessScopeSubjectControls({
  disabled = false
}: AccessScopeSubjectControlsProps) {
  const { values, setFieldValue } = useFormikContext<any>();
  const [subjectType, setSubjectType] = useState<"Person" | "Team">(
    values.team_id ? "Team" : "Person"
  );

  useEffect(() => {
    if (subjectType === "Person") {
      setFieldValue("team_id", undefined);
    } else {
      setFieldValue("person_id", undefined);
    }
  }, [subjectType, setFieldValue]);

  return (
    <div className="flex flex-col gap-2">
      <label className="form-label">Subject</label>
      <div>
        <div className="flex w-full flex-row">
          <Switch
            options={["Person", "Team"]}
            className="w-auto"
            value={subjectType}
            onChange={(v) => {
              if (!disabled) setSubjectType(v);
            }}
          />
        </div>

        {subjectType === "Person" && (
          <div className={disabled ? "pointer-events-none opacity-60" : ""}>
            <FormikPeopleDropdown
              name="person_id"
              required
              hint="Person who will have this access scope"
            />
          </div>
        )}
        {subjectType === "Team" && (
          <div className={disabled ? "pointer-events-none opacity-60" : ""}>
            <FormikTeamsDropdown
              name="team_id"
              required
              hint="Team that will have this access scope"
            />
          </div>
        )}
      </div>
    </div>
  );
}
