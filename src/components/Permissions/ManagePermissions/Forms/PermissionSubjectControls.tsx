import FormikPeopleDropdown from "@flanksource-ui/components/Forms/Formik/FormikPeopleDropdown";
import FormikTeamsDropdown from "@flanksource-ui/components/Forms/Formik/FormikTeamsDropdown";
import FormikNotificationDropdown from "@flanksource-ui/components/Forms/Formik/FormikNotificationDropdown";
import FormikRoleDropdown from "@flanksource-ui/components/Forms/Formik/FormikRoleDropdown";
import FormikPlaybooksDropdown from "@flanksource-ui/components/Forms/Formik/FormikPlaybooksDropdown";
import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import { useFormikContext } from "formik";
import { useEffect, useState } from "react";

const SWITCH_OPTION_TO_SUBJECT_TYPE = {
  Team: "team",
  Person: "person",
  Notification: "notification",
  Role: "group",
  Playbook: "playbook"
} as const;

export default function PermissionsSubjectControls() {
  const { values, setFieldValue } = useFormikContext<Record<string, any>>();

  const teamId = values.team_id;
  const personId = values.person_id;
  const notificationId = values.notification_id;
  const subject = values.subject;
  const subjectType = values.subject_type;

  const [switchOption, setSwitchOption] = useState<
    "Team" | "Person" | "Notification" | "Role" | "Playbook"
  >(() => {
    if (teamId || (subjectType === "team" && subject)) return "Team";
    if (personId || (subjectType === "person" && subject)) return "Person";
    if (notificationId || (subjectType === "notification" && subject))
      return "Notification";
    if (subjectType === "group" && subject) return "Role";
    if (subjectType === "playbook" && subject) return "Playbook";
    return "Person";
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
    } else if (subjectType === "playbook" && subject) {
      setSwitchOption("Playbook");
    }
  }, [teamId, personId, notificationId, subjectType, subject]);

  useEffect(() => {
    if (!subjectType) {
      setFieldValue(
        "subject_type",
        SWITCH_OPTION_TO_SUBJECT_TYPE[switchOption]
      );
    }
  }, [switchOption, subjectType, setFieldValue]);

  return (
    <div className="flex flex-col gap-2">
      <label className="form-label">Subject</label>
      <div>
        <div className="flex w-full flex-row">
          <Switch
            options={["Person", "Team", "Notification", "Role", "Playbook"]}
            className="w-auto"
            itemsClassName=""
            defaultValue="Go Template"
            value={switchOption}
            onChange={(v) => {
              setSwitchOption(v);
              setFieldValue("subject_type", SWITCH_OPTION_TO_SUBJECT_TYPE[v]);

              // These are old deprecated values that must never be set anymore.
              setFieldValue("person_id", undefined);
              setFieldValue("notification_id", undefined);
              setFieldValue("team_id", undefined);
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
        {switchOption === "Playbook" && (
          <FormikPlaybooksDropdown required name="subject" />
        )}
      </div>
    </div>
  );
}
