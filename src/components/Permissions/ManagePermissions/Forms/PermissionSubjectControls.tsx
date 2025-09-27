import FormikPeopleDropdown from "@flanksource-ui/components/Forms/Formik/FormikPeopleDropdown";
import FormikTeamsDropdown from "@flanksource-ui/components/Forms/Formik/FormikTeamsDropdown";
import FormikNotificationDropdown from "@flanksource-ui/components/Forms/Formik/FormikNotificationDropdown";
import FormikRoleDropdown from "@flanksource-ui/components/Forms/Formik/FormikRoleDropdown";
import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import { useFormikContext } from "formik";
import { useEffect, useState } from "react";

export default function PermissionsSubjectControls() {
  const { values, setFieldValue } = useFormikContext<Record<string, any>>();

  const teamId = values.team_id;
  const personId = values.person_id;
  const notificationId = values.notification_id;
  const subject = values.subject;
  const subjectType = values.subject_type;

  const [switchOption, setSwitchOption] = useState<
    "Team" | "Person" | "Notification" | "Role"
  >(() => {
    if (teamId || (subjectType === "team" && subject)) return "Team";
    if (personId || (subjectType === "person" && subject)) return "Person";
    if (notificationId || (subjectType === "notification" && subject))
      return "Notification";
    if (subjectType === "group" && subject) return "Role";
    return "Team";
  });

  useEffect(() => {
    if (teamId) {
      setSwitchOption("Team");
    } else if (personId || (subjectType === "person" && subject)) {
      setSwitchOption("Person");
    } else if (notificationId) {
      setSwitchOption("Notification");
    } else if (subjectType === "group" && subject) {
      setSwitchOption("Role");
    }
  }, [teamId, personId, notificationId, subjectType, subject]);

  return (
    <div className="flex flex-col gap-2">
      <label className="form-label">Subject</label>
      <div>
        <div className="flex w-full flex-row">
          <Switch
            options={["Team", "Person", "Notification", "Role"]}
            className="w-auto"
            itemsClassName=""
            defaultValue="Go Template"
            value={switchOption}
            onChange={(v) => {
              setSwitchOption(v);

              setFieldValue("person_id", undefined);
              setFieldValue("notification_id", undefined);
              setFieldValue("team_id", undefined);

              if (v === "Team") {
                setFieldValue("subject_type", "team");
              } else if (v === "Person") {
                setFieldValue("subject_type", "person");
              } else if (v === "Notification") {
                setFieldValue("subject_type", "notification");
              } else if (v === "Role") {
                setFieldValue("subject_type", "group");
              }
            }}
          />
        </div>

        {switchOption === "Team" && (
          <FormikTeamsDropdown required name="subject" />
        )}
        {switchOption === "Person" && (
          <FormikPeopleDropdown required name="subject" />
        )}
        {switchOption === "Notification" && (
          <FormikNotificationDropdown required name="subject" />
        )}
        {switchOption === "Role" && (
          <FormikRoleDropdown required name="subject" />
        )}
      </div>
    </div>
  );
}
