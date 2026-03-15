import { PropertyMetadata } from "@flanksource-ui/services/permissions/permissionsService";
import FormikCheckbox from "../Forms/Formik/FormikCheckbox";
import FormikDurationNanosecondsField from "../Forms/Formik/FormikDurationNanosecondsField";
import FormikNumberInput from "../Forms/Formik/FormikNumberInput";
import FormikTextInput from "../Forms/Formik/FormikTextInput";

type PropertyInputProps = {
  name: string;
  propertyMetadata?: PropertyMetadata;
  label?: string;
  disabled?: boolean;
};

export default function PropertyInput({
  name,
  propertyMetadata,
  label,
  disabled = false
}: PropertyInputProps) {
  const type = propertyMetadata?.type || "string";
  const description = propertyMetadata?.description;
  const defaultValue = propertyMetadata?.default;

  const hint =
    description ||
    (defaultValue !== undefined ? `Default: ${defaultValue}` : undefined);

  switch (type) {
    case "bool":
      return (
        <FormikCheckbox
          name={name}
          label={label}
          hint={hint}
          checkboxStyle="toggle"
          assertAsString
          disabled={disabled}
          inline
        />
      );

    case "int":
      return (
        <FormikNumberInput
          name={name}
          label={label}
          hint={hint}
          disabled={disabled}
        />
      );

    case "duration":
      return (
        <FormikDurationNanosecondsField name={name} label={label} hint={hint} />
      );

    case "string":
    default:
      return (
        <FormikTextInput
          name={name}
          label={label}
          hint={hint}
          disabled={disabled}
          className="flex flex-row items-center gap-2"
        />
      );
  }
}
