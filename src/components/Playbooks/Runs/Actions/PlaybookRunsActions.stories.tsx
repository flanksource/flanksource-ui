import { StoryObj } from "@storybook/react";
import PlaybookRunsActions, {
  PlaybookRunWithActions
} from "./PlaybookRunsActions";

export default {
  title: "PlaybookRunsActions",
  component: PlaybookRunsActions
};

const mockPlaybookRun: PlaybookRunWithActions = {
  id: "018b1865-4126-1d23-b99e-449d68a98a89",
  playbook_id: "018abbad-1869-23c9-61c2-1ad79513d598",
  status: "failed",
  created_at: "2023-10-10T07:02:50.917669+00:00",
  start_time: "2023-10-10T07:02:50.917669+00:00",
  end_time: "2023-10-10T07:02:50.957736+00:00",
  component_id: "0188a37d-09bb-eb45-18e3-c5ce7e5e80a1",
  parameters: {
    replicas: "1"
  },
  created_by: {
    id: "f4e2326c-9c37-4195-8677-40dd30ae824f",
    name: "Admin",
    email: ""
  },
  playbooks: {
    id: "018abbad-1869-23c9-61c2-1ad79513d598",
    name: "Demo Playbook"
  } as any,
  component: {
    id: "0188a37d-09bb-eb45-18e3-c5ce7e5e80a1",
    name: "flux",
    icon: "flux"
  },
  actions: [
    {
      id: "018b1865-414e-2b34-1adf-b9be35c47122",
      name: "Echo Test Playbook",
      status: "completed",
      playbook_run_id: "018b1865-4126-1d23-b99e-449d68a98a89",
      start_time: "2023-10-10T07:02:50.957736+00:00",
      end_time: "2023-10-10T07:02:50.957736+00:00",
      result: {
        stdout: "Test Playbook"
      }
    },
    {
      id: "018b1865-414e-8db5-91bc-75d92cc24384",
      name: "Hosts",
      status: "completed",
      playbook_run_id: "018b1865-4126-1d23-b99e-449d68a98a89",
      start_time: "2023-10-10T07:02:50.957736+00:00",
      end_time: "2023-10-10T07:02:50.957736+00:00",
      result: {
        stdout:
          "# Kubernetes-managed hosts file.\n127.0.0.1\tlocalhost\n::1\tlocalhost ip6-localhost ip6-loopback\nfe00::0\tip6-localnet\nfe00::0\tip6-mcastprefix\nfe00::1\tip6-allnodes\nfe00::2\tip6-allrouters\n10.244.3.51\tmission-control-77f6d4ccc7-98xql"
      }
    },
    {
      id: "018b1865-414e-f81a-ae39-15445b5c6f27",
      name: "ifconfig",
      status: "failed",
      playbook_run_id: "018b1865-4126-1d23-b99e-449d68a98a89",
      start_time: "2023-10-10T07:02:50.957736+00:00",
      end_time: "2023-10-10T07:02:50.957736+00:00",
      error: "bash: line 1: ifconfig: command not found: exit status 127"
    }
  ]
};
type Story = StoryObj<typeof PlaybookRunsActions>;

export const Default: Story = {
  render: () => <PlaybookRunsActions data={mockPlaybookRun} />
};
