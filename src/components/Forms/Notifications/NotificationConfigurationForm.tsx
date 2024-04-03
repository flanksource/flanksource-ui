import { Notification } from "@flanksource-ui/components/Notifications/notificationsTableColumns";
import { useFormikContext } from "formik";
import FormikConnectionField from "../Formik/FormikConnectionField";
import FormikTextArea from "../Formik/FormikTextArea";

export default function NotificationConfigurationForm() {
  const { values } = useFormikContext<Notification>();
  return (
    <div className="flex flex-col space-y-2">
      {values.source === "UI" ? (
        <FormikConnectionField
          name={`custom_services.0.connection`}
          label="Connection"
        />
      ) : (
        <FormikTextArea
          name={`custom_services.0.connection`}
          label="Connection"
          disabled
        />
      )}
    </div>
  );
}
