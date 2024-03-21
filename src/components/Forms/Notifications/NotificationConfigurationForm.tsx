import FormikConnectionField from "../Formik/FormikConnectionField";

export default function NotificationConfigurationForm() {
  return (
    <div className="flex flex-col space-y-2">
      <FormikConnectionField
        name={`custom_services.0.connection`}
        label="Connection"
      />
    </div>
  );
}
