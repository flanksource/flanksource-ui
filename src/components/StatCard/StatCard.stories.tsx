import { ComponentProps } from "react";
import { StatCard } from "./index";
import { Story } from "@storybook/react";

export default {
  title: "StatCard",
  component: StatCard
};

const Template = (arg: ComponentProps<typeof StatCard>) => (
  <StatCard {...arg} />
);

export const Variant1: Story<ComponentProps<typeof StatCard>> = Template.bind(
  {}
);

Variant1.args = {
  title: "StatCard",
  value: "value"
};
