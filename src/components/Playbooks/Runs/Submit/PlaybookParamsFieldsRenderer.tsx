import FormikBytesTextField from "@flanksource-ui/components/Forms/Formik/FormikBytesTextField";
import FormikMillicoresTextField from "@flanksource-ui/components/Forms/Formik/FormikMillicoresTextField";
import FormikResourceSelectorDropdown from "@flanksource-ui/components/Forms/Formik/FormikResourceSelectorDropdown";
import { ModalSize } from "@flanksource-ui/ui/Modal";
import { PlaybookParam } from "../../../../api/types/playbooks";
import FormikCheckbox from "../../../Forms/Formik/FormikCheckbox";
import { FormikCodeEditor } from "../../../Forms/Formik/FormikCodeEditor";
import FormikPeopleDropdown from "../../../Forms/Formik/FormikPeopleDropdown";
import FormikSelectDropdown from "../../../Forms/Formik/FormikSelectDropdown";
import FormikTeamsDropdown from "../../../Forms/Formik/FormikTeamsDropdown";
import FormikTextArea from "../../../Forms/Formik/FormikTextArea";
import FormikTextInput from "../../../Forms/Formik/FormikTextInput";

const sizeToClassName = new Map<ModalSize, string>([
  ["small", "h-72"],
  ["medium", "h-[min(36rem,calc(90vh))]"],
  ["large", "h-[min(54rem,calc(90vh))]"],
  ["full", "h-[calc(90vh)]"],
  ["very-small", "h-64"]
]);

type PlaybookParamsFieldsRendererProps = {
  params: PlaybookParam;
};

export default function PlaybookParamsFieldsRenderer({
  params
}: PlaybookParamsFieldsRendererProps) {
  const { type, name: fieldName, required, label } = params;
  switch (type) {
    case "code":
      const size = params.properties?.size ?? "small";
      const heightClassName = sizeToClassName.get(size);
      return (
        <FormikCodeEditor
          saveAsString
          className={`flex flex-col ${heightClassName}`}
          format={params.properties?.language ?? "yaml"}
          fieldName={`params.${fieldName}`}
          jsonSchemaUrl={params.properties?.jsonSchemaUrl}
        />
      );
    case "checkbox":
      return (
        <FormikCheckbox
          label={label}
          name={`params.${fieldName}`}
          required={required}
          assertAsString
        />
      );

    // todo: this needs options
    case "list":
      return (
        <FormikSelectDropdown
          name={`params.${fieldName}`}
          required={required}
          options={params.properties?.options ?? []}
        />
      );
    case "team":
      return (
        <FormikTeamsDropdown name={`params.${fieldName}`} required={required} />
      );
    case "people":
      return (
        <FormikPeopleDropdown
          name={`params.${fieldName}`}
          required={required}
        />
      );
    case "component":
      return (
        <FormikResourceSelectorDropdown
          name={`params.${fieldName}`}
          required={required}
          componentResourceSelector={params.properties?.filter}
        />
      );
    case "config":
      return (
        <FormikResourceSelectorDropdown
          name={`params.${fieldName}`}
          required={required}
          configResourceSelector={params.properties?.filter}
        />
      );
    case "check":
      return (
        <FormikResourceSelectorDropdown
          name={`params.${fieldName}`}
          required={required}
          checkResourceSelector={params.properties?.filter}
        />
      );
    case "text":
      if (params.properties?.multiline) {
        return (
          <FormikTextArea
            maxLength={params.properties?.maxLength}
            minLength={params.properties?.minLength}
            pattern={params.properties?.regex}
            name={`params.${fieldName}`}
            required={required}
          />
        );
      }

      if (params.properties?.format === "bytes") {
        return (
          <FormikBytesTextField
            name={`params.${fieldName}`}
            required={required}
            min={params.properties?.min}
            max={params.properties?.max}
          />
        );
      }

      if (params.properties?.format === "millicores") {
        return (
          <FormikMillicoresTextField
            name={`params.${fieldName}`}
            required={required}
            min={params.properties?.min}
            max={params.properties?.max}
          />
        );
      }

      if (params.properties?.format === "dns1123") {
        return (
          <FormikTextInput
            name={`params.${fieldName}`}
            required={required}
            pattern="[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*"
          />
        );
      }

      return (
        <FormikTextInput
          type={params.properties?.format}
          min={params.properties?.min}
          max={params.properties?.max}
          maxLength={params.properties?.maxLength}
          minLength={params.properties?.minLength}
          pattern={params.properties?.regex}
          name={`params.${fieldName}`}
          required={required}
        />
      );
    default:
      return (
        <FormikTextInput name={`params.${fieldName}`} required={required} />
      );
  }
}
