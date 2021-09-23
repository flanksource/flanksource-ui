import { TextWidget, CheckboxWidget } from "./Widgets";
import {
  DescriptionField,
  ArrayFieldTemplate,
  FieldTemplate,
  TitleField,
  ObjectFieldTemplate
} from "./Fields";

const customWidgets = {
  TextWidget,
  CheckboxWidget
};

const customFields = {
  DescriptionField,
  TitleField
};

export const TailwindUISchema = {};

export const Theme = {
  widgets: customWidgets,
  fields: customFields,
  ArrayFieldTemplate,
  ObjectFieldTemplate,
  FieldTemplate
};
