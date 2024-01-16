import { ComponentStory } from "@storybook/react";
import ConfigInsightsIcon from "./ConfigInsightsIcon";

export default {
  title: "AnalysisIcon",
  component: ConfigInsightsIcon,
  args: {
    analysis: {
      severity: "critical",
      analysis_type: "availability"
    }
  }
};

const Template: ComponentStory<typeof ConfigInsightsIcon> = (arg) => (
  <ConfigInsightsIcon {...arg} />
);

export const Default = Template.bind({});

export const WarmingSeverity = Template.bind({});

WarmingSeverity.story = {
  args: {
    analysis: { severity: "warning", analysis_type: "Performance" }
  }
};

export const InfoSeverity = Template.bind({});

InfoSeverity.story = {
  args: {
    analysis: { severity: "info", analysis_type: "compliance" }
  }
};
