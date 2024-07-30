import { Meta, StoryFn } from "@storybook/react";
import { HealthSummary } from "./HealthSummary";

export default {
  title: "HealthSummary",
  component: HealthSummary,
  decorators: [(Story) => <Story />]
} as Meta<typeof HealthSummary>;

const component = {
  name: "ip-10-0-6-82.eu-west-2.compute.internal",
  id: "017e83c8-c74c-c6b3-0bdb-8a6cc43982c5",
  icon: "server",
  status: "healthy",
  type: "KubernetesNode",
  summary: { title: "wtf s" },
  properties: [
    {
      name: "cpu",
      value: 630,
      unit: "millicores",
      max: 3920
    },
    {
      name: "memory",
      value: 13940244480,
      unit: "bytes",
      max: 15554052096
    },
    {
      name: "ephemeral-storage",
      unit: "bytes",
      max: 76224326324
    },
    {
      name: "instance-type",
      text: "t3.xlarge"
    },
    {
      name: "zone",
      text: "eu-west-2c"
    },
    {
      name: "ami"
    },
    {
      name: "operatingSystem",
      text: "linux"
    },
    {
      name: "kernelVersion",
      text: "5.4.129-63.229.amzn2.x86_64"
    },
    {
      name: "osImage",
      text: "Amazon Linux 2"
    },
    {
      name: "containerRuntimeVersion",
      text: "docker://19.3.13"
    },
    {
      name: "kubeProxyVersion",
      text: "v1.20.4-eks-6b7464"
    },
    {
      name: "architecture",
      text: "amd64"
    },
    {
      name: "kubeletVersion",
      text: "v1.20.4-eks-6b7464"
    }
  ],
  created_at: "2022-01-22T21:54:40.587458",
  updated_at: "2022-01-23T07:21:23.452554",
  external_id: "eu-west-2c/ip-10-0-6-82.eu-west-2.compute.internal"
};

const Template: StoryFn<typeof HealthSummary> = (arg) => (
  <HealthSummary {...arg} />
);

export const Variant1 = Template.bind({});
Variant1.args = {
  component: component as any,
  summary: ""
};
