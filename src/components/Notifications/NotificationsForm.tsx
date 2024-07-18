import { Form, Formik } from "formik";
import { Button } from "../../ui/Buttons/Button";
import { FormikCodeEditor } from "../Forms/Formik/FormikCodeEditor";
import FormikNotificationEventsDropdown from "../Forms/Formik/FormikNotificationEventsDropdown";
import FormikNotificationsTemplateField from "../Forms/Formik/FormikNotificationsTemplateField";
import FormikTextInput from "../Forms/Formik/FormikTextInput";
import NotificationsRecipientsTabs from "../Forms/Notifications/NotificationsRecipientsTabs";
import DeleteResource from "../SchemaResourcePage/Delete/DeleteResource";
import { Notification } from "./notificationsTableColumns";

type NotificationsFormProps = {
  onSubmit: (notification: Partial<Notification>) => void;
  notification?: Notification;
  onDeleted: () => void;
};

export default function NotificationsForm({
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
        onSubmit={(values) => onSubmit(values as Partial<Notification>)}
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
              <FormikTextInput name="title" label="Title" />
              <FormikNotificationEventsDropdown
                name="events"
                label="Events"
                required
              />
              <FormikTextInput name="filter" label="Filter" />
              <NotificationsRecipientsTabs />
              <FormikNotificationsTemplateField name="template" />
              <FormikCodeEditor
                fieldName="properties"
                label="Properties"
                className="flex h-32 flex-col"
                format="json"
              />
            </div>
            <div className="flex flex-row rounded-b-md bg-gray-100 p-4">
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
                {(notification?.source === "UI" || !notification?.source) && (
                  <Button
                    type="submit"
                    text={!!notification ? "Update" : "Save"}
                    className="btn-primary"
                  />
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
