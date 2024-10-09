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
  templateData: mockInput
};

export const WithKubeOptions = Template.bind({});

WithKubeOptions.args = {
  templateData: mockInputWithKubOptions
};

export const WithKubeOptionsAndValueFile = Template.bind({});

WithKubeOptionsAndValueFile.args = {
  templateData: mockInputWithValueFile
};
