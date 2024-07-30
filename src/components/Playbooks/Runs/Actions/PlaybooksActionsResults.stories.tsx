import { Meta, StoryFn } from "@storybook/react";
import { ComponentProps } from "react";
import PlaybooksRunActionsResults from "./PlaybooksActionsResults";

export default {
  title: "Components/PlaybooksRunActionsResults",
  component: PlaybooksRunActionsResults
} satisfies Meta<ComponentProps<typeof PlaybooksRunActionsResults>>;

const Template: StoryFn<ComponentProps<typeof PlaybooksRunActionsResults>> = (
  args
) => <PlaybooksRunActionsResults {...args} />;

export const NoResult = Template.bind({});
NoResult.args = {
  playbook: {
    name: "My Playbook"
  },
  action: {
    id: "1",
    playbook_run_id: "1",
    start_time: "2021-10-01T00:00:00Z"
  }
};

export const Stdout = Template.bind({});
Stdout.args = {
  playbook: {
    name: "My Playbook"
  },
  action: {
    id: "1",
    playbook_run_id: "1",
    start_time: "2021-10-01T00:00:00Z",
    result: {
      stdout: "Hello, world!"
    }
  }
};

export const Result = Template.bind({});
Result.args = {
  playbook: {
    name: "My Playbook"
  },
  action: {
    id: "1",
    start_time: "2021-10-01T00:00:00Z",
    playbook_run_id: "1",
    result: {
      foo: "bar",
      baz: 42
    }
  }
};

export const EmptyResult = Template.bind({});
EmptyResult.args = {
  playbook: {
    name: "My Playbook"
  },
  action: {
    id: "1",
    start_time: "2021-10-01T00:00:00Z",
    playbook_run_id: "1",
    result: {}
  }
};

export const UndefinedResult = Template.bind({});
UndefinedResult.args = {
  playbook: {
    name: "My Playbook"
  },
  action: {
    id: "1",
    start_time: "2021-10-01T00:00:00Z",
    playbook_run_id: "1",
    result: undefined
  }
};
