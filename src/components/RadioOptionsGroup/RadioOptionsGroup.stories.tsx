import { ComponentMeta, ComponentStory } from "@storybook/react";
import { IncidentSeverity } from "../../api/services/incident";
import { INCIDENT_SEVERITY_OPTIONS } from "../../constants/incidentOptions";
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
  options: INCIDENT_SEVERITY_OPTIONS,
  value: IncidentSeverity.High
};
