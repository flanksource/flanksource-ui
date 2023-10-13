import { StoryObj } from "@storybook/react";
import PlaybookRunsActions, {
  PlaybookRunWithActions
} from "./PlaybookRunsActions";

export default {
  title: "PlaybookRunsActions",
  component: PlaybookRunsActions
};

const mockPlaybookRun: PlaybookRunWithActions = {
  id: "1",
  playbook_id: "1",
  status: "completed",
  created_at: "2021-08-19T07:00:00.000Z",
  start_time: "2021-08-19T07:00:00.000Z",
  end_time: "2021-08-19T07:00:00.000Z",
  created_by: {
    id: "1",
    name: "John Doe",
    email: ""
  },
  component_id: "1",
  parameters: {},
  component: {
    id: "1",
    name: "Topology 1",
    icon: "TopologyIcon"
  },
  actions: [
    {
      id: "1",
      name: "Action 1",
      status: "completed",
      end_time: "2021-08-19T07:00:00.000Z",
      start_time: "2021-08-19T07:00:00.000Z",
      playbook_run_id: "1",
      result: `You can also use variant modifiers to target media queries like responsive breakpoints, dark mode, prefers-reduced-motion, and more. For example, use md:font-serif to apply the font-serif utility at only medium screen sizes and above.

You can also use variant modifiers to target media queries like responsive breakpoints, dark mode, prefers-reduced-motion, and more. For example, use md:font-serif to apply the font-serif utility at only medium screen sizes and above.

You can also use variant modifiers to target media queries like responsive breakpoints, dark mode, prefers-reduced-motion, and more. For example, use md:font-serif to apply the font-serif utility at only medium screen sizes and above.

You can also use variant modifiers to target media queries like responsive breakpoints, dark mode, prefers-reduced-motion, and more. For example, use md:font-serif to apply the font-serif utility at only medium screen sizes and above.`,
      error: ""
    },
    {
      id: "2",
      name: "Action 2",
      status: "completed",
      end_time: "2021-08-19T07:00:00.000Z",
      start_time: "2021-08-19T07:00:00.000Z",
      playbook_run_id: "1",
      result: `You can also use variant modifiers to target media queries like responsive breakpoints, dark mode, prefers-reduced-motion, and more. For example, use md:font-serif to apply the font-serif utility at only medium screen sizes and above.

You can also use variant modifiers to target media queries like responsive breakpoints, dark mode, prefers-reduced-motion, and more. For example, use md:font-serif to apply the font-serif utility at only medium screen sizes and above.`,
      error: ""
    },
    {
      id: "3",
      name: "Action 3",
      status: "pending",
      end_time: undefined,
      error: "",
      result: "",
      start_time: "2021-08-19T07:00:00.000Z",
      playbook_run_id: "1"
    },
    {
      id: "4",
      name: "Action 4",
      status: "running",
      end_time: undefined,
      error: "",
      result: "",
      start_time: "2021-08-19T07:00:00.000Z",
      playbook_run_id: "1"
    }
  ]
};

type Story = StoryObj<typeof PlaybookRunsActions>;

export const Default: Story = {
  render: () => <PlaybookRunsActions data={mockPlaybookRun} />
};
