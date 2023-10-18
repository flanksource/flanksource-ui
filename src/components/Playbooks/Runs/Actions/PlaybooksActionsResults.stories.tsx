import { Story, Meta } from "@storybook/react";
import PlaybooksRunActionsResults from "./PlaybooksActionsResults";
import { ComponentProps } from "react";

export default {
  title: "Components/PlaybooksRunActionsResults",
  component: PlaybooksRunActionsResults
} as Meta;

const Template: Story<ComponentProps<typeof PlaybooksRunActionsResults>> = (
  args
) => <PlaybooksRunActionsResults {...args} />;

export const NoResult = Template.bind({});
NoResult.args = {
  action: {}
};

export const Stdout = Template.bind({});
Stdout.args = {
  action: {
    result: {
      stdout: "Hello, world!"
    }
  }
};

export const Result = Template.bind({});
Result.args = {
  action: {
    result: {
      foo: "bar",
      baz: 42
    }
  }
};

export const EmptyResult = Template.bind({});
EmptyResult.args = {
  action: {
    result: {}
  }
};

export const UndefinedResult = Template.bind({});
UndefinedResult.args = {
  action: {
    result: undefined
  }
};
