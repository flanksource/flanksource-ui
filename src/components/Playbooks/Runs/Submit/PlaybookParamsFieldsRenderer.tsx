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

type PlaybookParamsFieldsRendererProps = {
  params: PlaybookParam;
};

export default function PlaybookParamsFieldsRenderer({
  params
}: PlaybookParamsFieldsRendererProps) {
  const { type, name: fieldName, required, label } = params;
  switch (type) {
    case "code":
      return (
        <FormikCodeEditor
          className="flex flex-col h-48"
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
          filter={params.properties?.filter}
        />
      );
    case "config":
      return (
        <FormikConfigsDropdown
          name={`params.${fieldName}`}
          required={required}
          filter={params.properties?.filter}
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
