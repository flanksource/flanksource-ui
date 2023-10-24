import { ComponentMeta, ComponentStory } from "@storybook/react";
import { IncidentSeverity } from "../../api/types/incident";
import { severityItems } from "../Incidents/data";
import { RadioOptionsGroup } from "./index";

export default {
  title: "RadioOptionsGroup",
  component: RadioOptionsGroup,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof RadioOptionsGroup>;

const Template: ComponentStory<typeof RadioOptionsGroup> = (arg: any) => (
  <RadioOptionsGroup {...arg} />
);

export const Base = Template.bind({});
Base.args = {
  options: Object.values(severityItems),
  value: IncidentSeverity.High
};
