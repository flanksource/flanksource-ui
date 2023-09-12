import FormikConnectionField from "../Formik/FormikConnectionField";
import FormikTextInput from "../Formik/FormikTextInput";

export default function NotificationConfigurationForm() {
  return (
    <div className="flex flex-col space-y-2">
      <FormikTextInput
        name={`custom_services.0.name`}
        label="Name"
        hint="A unique name to identify this notification configuration"
        required
      />

      <FormikConnectionField
        name={`custom_services.0.connection`}
        label="Connection"
      />
    </div>
  );
}
