import { withTheme } from "@rjsf/core";
import { Theme as MaterialUITheme } from "@rjsf/material-ui";
import { Theme as TailwindTheme } from "./TailwindTheme";

export function JsonForm({
  schema,
  uiSchema,
  theme,
  onSubmit,
  onChange,
  onError
}) {
  let ThemeObj;
  switch (theme) {
    case "tailwind":
      ThemeObj = TailwindTheme;
      break;
    default:
      ThemeObj = MaterialUITheme;
  }

  const ThemedForm = withTheme(ThemeObj);

  const formProps = {
    schema,
    onChange,
    onSubmit,
    onError,
    uiSchema
  };

  return <ThemedForm {...formProps} />;
}
