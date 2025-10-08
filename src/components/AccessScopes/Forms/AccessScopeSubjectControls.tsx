import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import FormikPeopleDropdown from "@flanksource-ui/components/Forms/Formik/FormikPeopleDropdown";
import FormikTeamsDropdown from "@flanksource-ui/components/Forms/Formik/FormikTeamsDropdown";
import { useFormikContext } from "formik";
import { useState, useEffect } from "react";

export default function AccessScopeSubjectControls() {
  const { values, setFieldValue } = useFormikContext<any>();
  const [subjectType, setSubjectType] = useState<"Person" | "Team">(
    values.person_id ? "Person" : "Team"
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
            onChange={(v) => setSubjectType(v)}
          />
        </div>

        {subjectType === "Person" && (
          <FormikPeopleDropdown
            name="person_id"
            required
            hint="Person who will have this access scope"
          />
        )}
        {subjectType === "Team" && (
          <FormikTeamsDropdown
            name="team_id"
            required
            hint="Team that will have this access scope"
          />
        )}
      </div>
    </div>
  );
}
