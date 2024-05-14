import { ComponentMeta, ComponentStory } from "@storybook/react";
import { EvidenceBuilder } from "./index";

export default {
  title: "EvidenceBuilder",
  component: EvidenceBuilder,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof EvidenceBuilder>;

const Template: ComponentStory<typeof EvidenceBuilder> = (arg: any) => (
  <EvidenceBuilder {...arg} />
);

export const Variant1 = Template.bind({});
