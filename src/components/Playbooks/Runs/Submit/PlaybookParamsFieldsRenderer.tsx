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
  const { type, name: fieldName, label, required } = params;
  switch (type) {
    case "code":
      return (
        <FormikCodeEditor
          className="flex flex-col h-48"
          format={params.properties?.language ?? "yaml"}
          fieldName={fieldName}
          label={label}
        />
      );
    case "checkbox":
      return (
        <FormikCheckbox name={fieldName} label={label} required={required} />
      );

    // todo: this needs options
    case "list":
      return (
        <FormikSelectDropdown
          name={fieldName}
          label={label}
          required={required}
          options={params.properties?.options ?? []}
        />
      );
    case "team":
      return (
        <FormikTeamsDropdown
          name={fieldName}
          label={label}
          required={required}
        />
      );
    case "people":
      return (
        <FormikPeopleDropdown
          name={fieldName}
          label={label}
          required={required}
        />
      );
    case "component":
      return (
        <FormikComponentsDropdown
          name={fieldName}
          label={label}
          required={required}
          filter={params.properties?.filter}
        />
      );
    case "config":
      return (
        <FormikConfigsDropdown
          name={fieldName}
          label={label}
          required={required}
          filter={params.properties?.filter}
        />
      );
    case "text":
      if (params.properties?.multiline) {
        return (
          <FormikTextArea name={fieldName} label={label} required={required} />
        );
      }
      return (
        <FormikTextInput name={fieldName} label={label} required={required} />
      );
    default:
      return null;
  }
}
