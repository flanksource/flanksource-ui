import { ComponentStory } from "@storybook/react";
import { Gauge } from "./index";

export default {
  title: "Gauge",
  component: Gauge
};

const Template: ComponentStory<typeof Gauge> = (arg) => <Gauge {...arg} />;

export const VariantWithDefaultColorsAndLabel = Template.bind({});
VariantWithDefaultColorsAndLabel.args = {
  value: 50,
  units: "%",
  minValue: 0,
  maxValue: 100
};

export const VariantWithCustomColorsAndLabel = Template.bind({});
VariantWithCustomColorsAndLabel.args = {
  value: 50,
  units: "%",
  minValue: 0,
  maxValue: 100,
  width: "20em",
  arcColor: "blue",
  arcBgColor: "#3e3e3e",
  label: <>Memory Used: 50%</>
};
