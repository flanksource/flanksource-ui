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
  action: {
    name: "My Action",
    status: "completed",
    id: "1",
    playbook_run_id: "1",
    start_time: "2021-10-01T00:00:00Z"
  }
};

export const Stdout = Template.bind({});
Stdout.args = {
  action: {
    name: "My Action",
    status: "completed",
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
  action: {
    name: "My Action",
    status: "completed",
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
  action: {
    name: "My Action",
    status: "completed",
    id: "1",
    start_time: "2021-10-01T00:00:00Z",
    playbook_run_id: "1",
    result: {}
  }
};

export const UndefinedResult = Template.bind({});
UndefinedResult.args = {
  action: {
    name: "My Action",
    status: "completed",
    id: "1",
    start_time: "2021-10-01T00:00:00Z",
    playbook_run_id: "1",
    result: undefined
  }
};

export const AIWithSmallCost = Template.bind({});
AIWithSmallCost.args = {
  action: {
    name: "Analyze incident",
    status: "completed",
    id: "1",
    start_time: "2026-07-08T12:53:40Z",
    end_time: "2026-07-08T12:53:49Z",
    playbook_run_id: "1",
    type: "ai",
    result: {
      json: JSON.stringify(
        {
          headline:
            "flanksource-ui/Release Unhealthy: Repository Access Blocked",
          summary:
            "The workflow is unhealthy because repository access is blocked.",
          recommended_fix:
            "Verify repository access and GitHub token permissions."
        },
        null,
        2
      ),
      generationInfo: [
        {
          cost: 0.0018809,
          model: "gemini-2.5-flash",
          inputTokens: 778,
          outputTokens: 131,
          reasoningTokens: 528
        },
        {
          cost: 0.0017708999999999997,
          model: "gemini-2.5-flash",
          inputTokens: 4053,
          outputTokens: 10,
          reasoningTokens: 212
        }
      ]
    }
  }
};
AIWithSmallCost.decorators = [
  (Story) => (
    <div className="h-[500px] w-[780px] pt-16">
      <Story />
    </div>
  )
];
