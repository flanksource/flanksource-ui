import FormikPeopleDropdown from "@flanksource-ui/components/Forms/Formik/FormikPeopleDropdown";
import FormikTeamsDropdown from "@flanksource-ui/components/Forms/Formik/FormikTeamsDropdown";
import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import { useFormikContext } from "formik";
import { useEffect, useState } from "react";

export default function PermissionsSubjectControls() {
  const { values, setFieldValue } = useFormikContext<Record<string, any>>();

  const teamId = values.team_id;
  const personId = values.person_id;

  const [switchOption, setSwitchOption] = useState<"Team" | "Person">(() => {
    if (teamId) return "Team";
    if (personId) return "Person";
    return "Team";
  });

  useEffect(() => {
    if (teamId) {
      setSwitchOption("Team");
    } else if (personId) {
      setSwitchOption("Person");
    }
  }, [teamId, personId]);

  return (
    <div className="flex flex-col gap-2">
      <label className={`form-label`}>Subject</label>
      <div>
        <div className="flex w-full flex-row">
          <Switch
            options={["Team", "Person"]}
            className="w-auto"
            itemsClassName=""
            defaultValue="Go Template"
            value={switchOption}
            onChange={(v) => {
              setSwitchOption(v);
              if (v === "Team") {
                setFieldValue("person_id", undefined);
              } else {
                setFieldValue("team_id", undefined);
              }
            }}
          />
        </div>

        {switchOption === "Team" ? (
          <FormikTeamsDropdown required name="team_id" />
        ) : (
          <FormikPeopleDropdown required name="person_id" />
        )}
      </div>
    </div>
  );
}
