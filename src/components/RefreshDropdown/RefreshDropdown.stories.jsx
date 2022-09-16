import RefreshDropdown from "./index";

export default {
  title: "RefreshDropdown",
  component: RefreshDropdown,
  args: {
    // eslint-disable-next-line no-alert
    onClick: () => alert("hello!"),
    className: ""
  }
};

const Template = (arg) => <RefreshDropdown {...arg} />;

export const Default = Template.bind({});

export const LoadingAnimation = Template.bind({});

LoadingAnimation.story = {
  args: {
    isLoading: true
  }
};

export const WithTimeRangeSetTo2Hr = Template.bind();

WithTimeRangeSetTo2Hr.story = {
  parameters: {
    nextRouter: {
      query: {
        timeRange: "2h"
      }
    }
  }
};

export const WithTimeRangeSetTo3Hr = Template.bind();

WithTimeRangeSetTo3Hr.story = {
  parameters: {
    nextRouter: {
      query: {
        timeRange: "3h"
      }
    }
  }
};
