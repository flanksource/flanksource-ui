import { ComponentStory } from "@storybook/react";
import { OptionsList } from "./OptionsList";

export default {
  title: "OptionsList",
  component: OptionsList
};

const Template: ComponentStory<typeof OptionsList> = (args) => (
  <OptionsList {...args} />
);

export const Variant1 = Template.bind({});

Variant1.args = {
  options: [
    { label: "ServiceNow", value: "ServiceNow", icon: "servicenow" },
    { label: "CA", value: "CA", icon: "ca" },
    { label: "AWS Support", value: "AWS Support", icon: "aws" },
    {
      label: "AWS AMS Service Request",
      value: "AWS AMS Service Request",
      icon: "aws"
    },
    { label: "Redhat", value: "Redhat", icon: "redhat" },
    { label: "Oracle", value: "Oracle", icon: "oracle_icon" },
    { label: "Microsoft", value: "Microsoft", icon: "microsoft" }
  ],
  onSelect: (e: any) => {
    console.log(e);
  },
  value: { label: "Microsoft", value: "Microsoft", icon: "microsoft" } as any
};
