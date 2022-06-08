import { ComponentMeta, ComponentStory } from "@storybook/react";
import { SearchSelectTag } from "./index";
import sampleConfigList from "../../data/sampleConfigList";

export default {
  title: "SearchSelectTag",
  component: SearchSelectTag,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof SearchSelectTag>;

const TagTemplate: ComponentStory<typeof SearchSelectTag> = (args: any) => (
  <div className="w-80">
    <SearchSelectTag {...args} />
  </div>
);

const configTagData = sampleConfigList.flatMap((d) => Object.entries(d.tags));

export const WithTags = TagTemplate.bind({});
WithTags.args = {
  tags: configTagData
};
