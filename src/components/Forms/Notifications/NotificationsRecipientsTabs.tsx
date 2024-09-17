import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { Tab, Tabs } from "../../../ui/Tabs/Tabs";
import { NotificationRules } from "../../Notifications/Rules/notificationsRulesTableColumns";
import FormikPeopleDropdown from "../Formik/FormikPeopleDropdown";
import FormikTeamsDropdown from "../Formik/FormikTeamsDropdown";
import NotificationConfigurationForm from "./NotificationConfigurationForm";

type ActiveTab = "Person" | "Team" | "Others";

const subjectTabs = [
  {
    label: "Person",
    value: "Person"
  },
  {
    label: "Team",
    value: "Team"
  },
  {
    label: "Others",
    value: "Others"
  }
];

export default function NotificationsRecipientsTabs() {
  const { values, setFieldValue } = useFormikContext<NotificationRules>();

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (values.person_id) {
      return "Person";
    }
    if (values.team_id) {
      return "Team";
    }
    if (values.custom_services) {
      return "Others";
    }
    return "Person";
  });

  // Reset values when switching tabs
  useEffect(() => {
    if (activeTab !== "Person") {
      setFieldValue("person_id", undefined);
    }
    if (activeTab !== "Team") {
      setFieldValue("team_id", undefined);
    }
    if (activeTab !== "Others") {
      setFieldValue("custom_services", undefined);
    }
  }, [activeTab, setFieldValue, values]);

  return (
    <div className="flex flex-col">
      <label className="mb-2 text-sm font-semibold">Recipient</label>
      <Tabs
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab as ActiveTab)}
        contentClassName="flex flex-col flex-1  bg-white border border-t-0 border-gray-300"
      >
        {subjectTabs.map(({ label, value }) => {
          return (
            <Tab
              key={label}
              label={label}
              value={value}
              className="flex flex-col p-2"
            >
              <div className={`flex flex-col gap-4`}>
                {activeTab === "Person" ? (
                  <FormikPeopleDropdown name={"person_id"} />
                ) : activeTab === "Team" ? (
                  <FormikTeamsDropdown name={"team_id"} />
                ) : (
                  <NotificationConfigurationForm />
                )}
              </div>
            </Tab>
          );
        })}
      </Tabs>
    </div>
  );
}
