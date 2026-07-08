import { PlaybookRunWithActions } from "@flanksource-ui/api/types/playbooks";
import { HttpResponse, http } from "msw";
import { ComponentProps } from "react";
import { Meta, StoryFn } from "@storybook/react";
import PlaybookRunDetailView from "./PlaybookRunsActions";

const aiAction = {
  playbook_run_id: "run-1",
  id: "action-ai",
  name: "analyse",
  status: "completed" as const,
  start_time: "2026-07-08T12:53:40Z",
  end_time: "2026-07-08T12:53:49Z",
  type: "ai" as const,
  result: {
    json: JSON.stringify(
      {
        headline: "flanksource-ui/Release Unhealthy: Repository Access Blocked",
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
};

const notificationAction = {
  playbook_run_id: "run-1",
  id: "action-notification",
  name: "send recommended playbooks",
  status: "completed" as const,
  start_time: "2026-07-08T12:53:49Z",
  end_time: "2026-07-08T12:53:50Z",
  type: "notification" as const,
  result: {
    title: "Recommended playbooks",
    message: "Recommendation sent"
  }
};

const playbookRun = {
  id: "run-1",
  playbook_id: "playbook-1",
  spec: {
    actions: [
      { name: "send recommended playbooks", notification: {} },
      { name: "analyse", ai: {} }
    ]
  },
  playbooks: {
    id: "playbook-1",
    name: "Recommend Playbooks",
    title: "Recommend Playbooks",
    source: "UI",
    created_at: "2026-07-08T12:53:00Z",
    updated_at: "2026-07-08T12:53:00Z",
    spec: {
      actions: [
        { name: "send recommended playbooks", notification: {} },
        { name: "analyse", ai: {} }
      ]
    }
  },
  status: "completed",
  created_at: "2026-07-08T12:53:40Z",
  scheduled_time: "2026-07-08T12:53:40Z",
  start_time: "2026-07-08T12:53:40Z",
  end_time: "2026-07-08T12:53:50Z",
  config: {
    id: "config-1",
    name: "flanksource-ui/Release",
    type: "GitHubAction",
    config_class: "Deployment"
  },
  actions: [notificationAction, aiAction]
} satisfies PlaybookRunWithActions;

export default {
  title: "Components/PlaybookRunDetailView",
  component: PlaybookRunDetailView,
  parameters: {
    msw: {
      handlers: [
        http.get("/api/db/playbook_run_actions", () => {
          return HttpResponse.json([aiAction]);
        })
      ]
    }
  }
} satisfies Meta<ComponentProps<typeof PlaybookRunDetailView>>;

const Template: StoryFn<ComponentProps<typeof PlaybookRunDetailView>> = (
  args
) => <PlaybookRunDetailView {...args} />;

export const SmallTotalCost = Template.bind({});
SmallTotalCost.args = {
  data: playbookRun
};
SmallTotalCost.decorators = [
  (Story) => (
    <div className="h-[620px] w-[1120px] pt-12">
      <Story />
    </div>
  )
];
