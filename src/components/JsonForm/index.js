import { withTheme } from "@rjsf/core";
import { Theme as MaterialUITheme } from "@rjsf/material-ui";
import { Theme as TailwindTheme } from "./tailwindTheme";

export function JsonForm({ schema, theme }) {
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
    onChange: () => {},
    onSubmit: () => {},
    onError: () => {}
  };

  return <ThemedForm {...formProps} />;
}
