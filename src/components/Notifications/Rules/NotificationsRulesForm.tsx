import { NotificationRules } from "@flanksource-ui/api/types/notifications";
import FormikDurationNanosecondsField from "@flanksource-ui/components/Forms/Formik/FormikDurationNanosecondsField";
import { Form, Formik } from "formik";
import { Button } from "../../../ui/Buttons/Button";
import FormikAutocompleteDropdown from "../../Forms/Formik/FormikAutocompleteDropdown";
import { FormikCodeEditor } from "../../Forms/Formik/FormikCodeEditor";
import FormikNotificationEventsDropdown from "../../Forms/Formik/FormikNotificationEventsDropdown";
import FormikNotificationsTemplateField from "../../Forms/Formik/FormikNotificationsTemplateField";
import FormikTextInput from "../../Forms/Formik/FormikTextInput";
import NotificationsRecipientsTabs from "../../Forms/Notifications/NotificationsRecipientsTabs";
import DeleteResource from "../../SchemaResourcePage/Delete/DeleteResource";
import CanEditResource from "../../Settings/CanEditResource";
import ErrorMessage from "@flanksource-ui/ui/FormControls/ErrorMessage";
import { omit } from "lodash";
import FormikNotificationGroupByDropdown from "@flanksource-ui/components/Forms/Formik/FormikNotificationGroupByDropdown";

type NotificationsFormProps = {
  onSubmit: (notification: Partial<NotificationRules>) => void;
  notification?: NotificationRules;
  onDeleted: () => void;
};

export default function NotificationsRulesForm({
  onSubmit,
  notification,
  onDeleted = () => {}
}: NotificationsFormProps) {
  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto">
      <Formik
        initialValues={{
          ...notification,
          person: undefined,
          team: undefined,
          created_by: notification?.created_by?.id,
          created_at: undefined,
          updated_at: undefined,
          ...(!notification?.id && { source: "UI" })
        }}
        onSubmit={(values) =>
          onSubmit(
            omit(values, "most_common_error") as Partial<NotificationRules>
          )
        }
        validateOnBlur
        validateOnChange
      >
        {({ handleSubmit, handleReset }) => (
          <Form
            onReset={handleReset}
            onSubmit={(e) => handleSubmit(e)}
            className="flex flex-1 flex-col gap-4 overflow-y-auto"
          >
            <div className="flex flex-col gap-4 overflow-y-auto p-4">
              <FormikTextInput name="name" label="Name" />
              <FormikNotificationEventsDropdown
                name="events"
                label="Events"
                required
              />
              <FormikTextInput name="filter" label="Filter" />
              <ErrorMessage
                message={notification?.most_common_error}
                className="h-full pl-2 align-top"
              />

              <FormikNotificationGroupByDropdown
                name="group_by"
                label="Group By"
                hint="Notifications are grouped by these set of keys and only one per group is sent within the specified repeat interval."
              />

              <NotificationsRecipientsTabs />
              <FormikAutocompleteDropdown
                isClearable
                options={[
                  { label: "1h", value: "1h" },
                  { label: "2h", value: "2h" },
                  { label: "3h", value: "3h" },
                  { label: "6h", value: "6h" },
                  { label: "1d", value: "1d" },
                  { label: "1w", value: "1w" },
                  { label: "1m", value: "1m" }
                ]}
                name="repeat_interval"
                label="Repeat Interval"
              />
              <FormikDurationNanosecondsField
                isClearable
                name="wait_for"
                label="Wait For"
              />
              <FormikDurationNanosecondsField
                isClearable
                name="wait_for_eval_period"
                label="Wait For Eval Period"
                hint="An additional delay after Wait For period to evaluate healths of Kubernetes configs"
              />
              <FormikTextInput
                name="title"
                label="Title"
                hint="The title of the notification that's sent out"
                hintPosition="top"
              />
              <FormikNotificationsTemplateField name="template" />
              <FormikCodeEditor
                fieldName="properties"
                label="Properties"
                className="flex h-32 flex-col"
                format="json"
              />
            </div>
            <div className="flex flex-row rounded-b-md bg-gray-100 p-4">
              <CanEditResource
                id={notification?.id}
                resourceType={"notifications"}
                source={notification?.source}
              >
                <div className="flex flex-1 flex-row justify-end space-x-4">
                  {!!notification && (
                    <DeleteResource
                      resourceId={notification.id}
                      resourceInfo={{
                        table: "notifications",
                        name: "Notifications",
                        api: "config-db"
                      }}
                      onDeleted={onDeleted}
                    />
                  )}
                  <div className="flex-1" />
                  {(notification?.source === "UI" || !notification?.source) && (
                    <Button
                      type="submit"
                      text={!!notification ? "Update" : "Save"}
                      className="btn-primary"
                    />
                  )}
                </div>
              </CanEditResource>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
