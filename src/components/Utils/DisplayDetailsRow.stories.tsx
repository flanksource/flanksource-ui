import { Meta } from "@storybook/react";
import DisplayDetailsRow from "./DisplayDetailsRow";

export default {
  title: "DisplayDetailsRow",
  component: DisplayDetailsRow
} satisfies Meta;

export const Default = () => {
  return (
    <DisplayDetailsRow
      items={[
        {
          label: "Name",
          value: "Value"
        },
        {
          label: "Name",
          value: "Value"
        }
      ]}
    />
  );
};

export const WithVeryLongValues = () => {
  return (
    <DisplayDetailsRow
      items={[
        {
          label: "Name",
          value: "Value".repeat(100)
        }
      ]}
    />
  );
};

export const WithVeryLongParagraphValues = () => {
  return (
    <DisplayDetailsRow
      items={[
        {
          label: "Name",
          value: "Value ".repeat(100)
        }
      ]}
    />
  );
};
