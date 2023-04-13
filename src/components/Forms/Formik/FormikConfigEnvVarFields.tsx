import FormikCheckbox from "./FormikCheckbox";
import FormikTextInput from "./FormikTextInput";

type FormikConfigEnvVarFieldsProps = {
  name: string;
  className?: string;
};

/**
 *
 * FormikConfigEnvVarFields
 *
 * Renders Formik form fields needed to edit a Config Env Var object.
 *
 * Does not have a label, needs to be wrapped in a Label container.
 *
 */
export default function FormikEnvVarConfigsFields({
  name,
  className = "flex flex-col space-y-2 w-full"
}: FormikConfigEnvVarFieldsProps) {
  return (
    <div className={className}>
      <FormikTextInput name={`${name}.name`} label="Name" />
      <FormikTextInput name={`${name}.value`} label="Value" />
      <div className="flex flex-col space-y-2">
        <label className="font-semibold">Value From</label>
        <div className="flex flex-col p-4 space-y-2">
          <div className="flex flex-col space-y-2">
            <label className="font-semibold">Config Map Key Ref</label>
            <div className="flex flex-col p-4 space-y-2">
              <FormikTextInput
                name={`${name}.valueFrom.configMapKeyRef.name`}
                label="Name"
              />
              <FormikTextInput
                name={`${name}.valueFrom.configMapKeyRef.key`}
                label="Key"
              />
              <FormikCheckbox
                name={`${name}.valueFrom.configMapKeyRef.optional`}
                label="Optional"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <label className="font-semibold">Secret Key Ref</label>
            <div className="flex flex-col p-4 space-y-2">
              <FormikTextInput
                name={`${name}.valueFrom.secretKeyRef.name`}
                label="Name"
              />
              <FormikTextInput
                name={`${name}.valueFrom.secretKeyRef.key`}
                label="Key"
              />
              <FormikCheckbox
                name={`${name}.valueFrom.secretKeyRef.optional`}
                label="Optional"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
