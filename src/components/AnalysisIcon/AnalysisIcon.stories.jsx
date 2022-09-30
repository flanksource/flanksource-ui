import AnalysisIcon from "./index";

export default {
  title: "AnalysisIcon",
  component: AnalysisIcon,
  args: {
    analysis: {
      severity: "critical",
      analysis_type: "availability"
    }
  }
};

const Template = (arg) => <AnalysisIcon {...arg} />;

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
