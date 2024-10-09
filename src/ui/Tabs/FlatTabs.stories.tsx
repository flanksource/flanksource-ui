import { Meta, StoryFn } from "@storybook/react";
import { useState } from "react";
import FlatTabs from "./FlatTabs";

export default {
  title: "ui/FlatTabs",
  component: FlatTabs
} satisfies Meta<typeof FlatTabs>;

const Template: StoryFn<typeof FlatTabs> = () => {
  const [activeTab, setActiveTab] = useState<"tab1" | "tab2">("tab1");

  return (
    <FlatTabs
      tabs={[
        {
          label: "Tab 1",
          key: "tab1",
          current: activeTab === "tab1",
          content: <div>Tab 1 content</div>
        },
        {
          label: "Tab 2",
          key: "tab2",
          current: activeTab === "tab2",
          content: <div>Tab 2 content</div>
        }
      ]}
      activeTab={activeTab}
      setActiveTab={(t) => setActiveTab(t)}
    />
  );
};

export const Default = Template.bind({});
Default.args = {};
