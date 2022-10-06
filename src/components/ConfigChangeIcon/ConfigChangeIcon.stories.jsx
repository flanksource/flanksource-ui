import ConfigChangeIcon from "./index";

export default {
  title: "ConfigChangeIcon",
  component: ConfigChangeIcon,
  args: {
    changeType: "add"
  }
};

const Template = (arg) => <ConfigChangeIcon {...arg} />;

export const Default = Template.bind({});

export const DiffIcon = Template.bind({});

DiffIcon.story = {
  args: {
    changeType: "diff"
  }
};
