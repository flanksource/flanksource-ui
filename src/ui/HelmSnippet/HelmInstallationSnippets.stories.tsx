import { Meta, StoryFn } from "@storybook/react";
import HelmInstallationSnippets from "./HelmInstallationSnippets";
import {
  mockInput,
  mockInputWithKubOptions,
  mockInputWithValueFile
} from "./__tests__/mocks/mocks";

export default {
  title: "ui/HelmInstallationSnippets",
  component: HelmInstallationSnippets
} satisfies Meta<typeof HelmInstallationSnippets>;

const Template: StoryFn<typeof HelmInstallationSnippets> = (args) => (
  <HelmInstallationSnippets {...args} />
);

export const Default = Template.bind({});

Default.args = {
  charts: [mockInput]
};

export const WithKubeOptions = Template.bind({});

WithKubeOptions.args = {
  charts: mockInputWithKubOptions
};

export const WithKubeOptionsAndValueFile = Template.bind({});

WithKubeOptionsAndValueFile.args = {
  charts: mockInputWithValueFile
};
