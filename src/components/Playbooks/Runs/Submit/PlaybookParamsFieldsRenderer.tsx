import { ModalSize } from "@flanksource-ui/ui/Modal";
import { PlaybookParam } from "../../../../api/types/playbooks";
import FormikCheckbox from "../../../Forms/Formik/FormikCheckbox";
import { FormikCodeEditor } from "../../../Forms/Formik/FormikCodeEditor";
import FormikComponentsDropdown from "../../../Forms/Formik/FormikComponentsDropdown";
import FormikConfigsDropdown from "../../../Forms/Formik/FormikConfigsDropdown";
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
  ["slightly-small", "h-64"]
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
        />
      );
    case "checkbox":
      return (
        <FormikCheckbox
          label={label}
          name={`params.${fieldName}`}
          required={required}
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
        <FormikComponentsDropdown
          name={`params.${fieldName}`}
          required={required}
          filter={{
            types: params.properties?.filter.type
              ? [params.properties?.filter.type]
              : []
          }}
        />
      );
    case "config":
      return (
        <FormikConfigsDropdown
          name={`params.${fieldName}`}
          required={required}
          filter={{
            types: params.properties?.filter.type
              ? [params.properties?.filter.type]
              : []
          }}
        />
      );
    case "text":
      if (params.properties?.multiline) {
        return (
          <FormikTextArea name={`params.${fieldName}`} required={required} />
        );
      }
      return (
        <FormikTextInput name={`params.${fieldName}`} required={required} />
      );
    default:
      return (
        <FormikTextInput name={`params.${fieldName}`} required={required} />
      );
  }
}
