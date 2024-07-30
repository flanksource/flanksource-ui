import { ComponentMeta, ComponentStory } from "@storybook/react";
import RefreshDropdown from "./index";
export default {
  title: "RefreshDropdown",
  component: RefreshDropdown,
  decorators: [(Story) => <Story />],
  args: {
    // eslint-disable-next-line no-alert
    onClick: () => alert("hello!"),
    className: ""
  }
} as ComponentMeta<typeof RefreshDropdown>;

const Template: ComponentStory<typeof RefreshDropdown> = (arg) => (
  <RefreshDropdown {...arg} />
);

export const Default = Template.bind({});

export const LoadingAnimation = Template.bind({});

LoadingAnimation.story = {
  args: {
    isLoading: true
  }
};

export const WithTimeRangeSetTo2Hr = Template.bind({});

WithTimeRangeSetTo2Hr.story = {
  parameters: {
    nextRouter: {
      query: {
        timeRange: "2h"
      }
    }
  }
};

export const WithTimeRangeSetTo3Hr = Template.bind({});

WithTimeRangeSetTo3Hr.story = {
  parameters: {
    nextRouter: {
      query: {
        timeRange: "3h"
      }
    }
  }
};
