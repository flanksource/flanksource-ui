import FormikPeopleDropdown from "@flanksource-ui/components/Forms/Formik/FormikPeopleDropdown";
import FormikTeamsDropdown from "@flanksource-ui/components/Forms/Formik/FormikTeamsDropdown";
import FormikNotificationDropdown from "@flanksource-ui/components/Forms/Formik/FormikNotificationDropdown";
import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import { useFormikContext } from "formik";
import { useEffect, useState } from "react";

export default function PermissionsSubjectControls() {
  const { values, setFieldValue } = useFormikContext<Record<string, any>>();

  const teamId = values.team_id;
  const personId = values.person_id;
  const notificationId = values.notification_id;

  const [switchOption, setSwitchOption] = useState<
    "Team" | "Person" | "Notification"
  >(() => {
    if (teamId) return "Team";
    if (personId) return "Person";
    if (notificationId) return "Notification";
    return "Team";
  });

  useEffect(() => {
    if (teamId) {
      setSwitchOption("Team");
    } else if (personId) {
      setSwitchOption("Person");
    } else if (notificationId) {
      setSwitchOption("Notification");
    }
  }, [teamId, personId, notificationId]);

  return (
    <div className="flex flex-col gap-2">
      <label className="form-label">Subject</label>
      <div>
        <div className="flex w-full flex-row">
          <Switch
            options={["Team", "Person", "Notification"]}
            className="w-auto"
            itemsClassName=""
            defaultValue="Go Template"
            value={switchOption}
            onChange={(v) => {
              setSwitchOption(v);
              if (v === "Team") {
                setFieldValue("person_id", undefined);
                setFieldValue("notification_id", undefined);
              } else if (v === "Person") {
                setFieldValue("team_id", undefined);
                setFieldValue("notification_id", undefined);
              } else {
                setFieldValue("team_id", undefined);
                setFieldValue("person_id", undefined);
              }
            }}
          />
        </div>

        {switchOption === "Team" && (
          <FormikTeamsDropdown required name="team_id" />
        )}
        {switchOption === "Person" && (
          <FormikPeopleDropdown required name="person_id" />
        )}
        {switchOption === "Notification" && (
          <FormikNotificationDropdown required name="notification_id" />
        )}
      </div>
    </div>
  );
}
