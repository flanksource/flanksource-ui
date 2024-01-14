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
          fieldName={fieldName}
        />
      );
    case "checkbox":
      return (
        <FormikCheckbox label={label} name={fieldName} required={required} />
      );

    // todo: this needs options
    case "list":
      return (
        <FormikSelectDropdown
          name={fieldName}
          required={required}
          options={params.properties?.options ?? []}
        />
      );
    case "team":
      return <FormikTeamsDropdown name={fieldName} required={required} />;
    case "people":
      return <FormikPeopleDropdown name={fieldName} required={required} />;
    case "component":
      return (
        <FormikComponentsDropdown
          name={fieldName}
          required={required}
          filter={params.properties?.filter}
        />
      );
    case "config":
      return (
        <FormikConfigsDropdown
          name={fieldName}
          required={required}
          filter={params.properties?.filter}
        />
      );
    case "text":
      if (params.properties?.multiline) {
        return <FormikTextArea name={fieldName} required={required} />;
      }
      return <FormikTextInput name={fieldName} required={required} />;
    default:
      return null;
  }
}
