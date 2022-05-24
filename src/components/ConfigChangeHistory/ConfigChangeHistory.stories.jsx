import { ConfigChangeHistory } from "./index";

export default {
  title: "ConfigChangeHistory",
  component: ConfigChangeHistory
};

const Template = (args) => <ConfigChangeHistory {...args} />;

export const Default = Template.bind({});

const codeSample = (x) => ({
  sample: `${x}`,
  key: "value",
  another_key: "another_value",
  nested: {
    nk: "nested_val"
  },
  arr: [1, 2, 3],
  num_val: 2
});

const data = Array(10)
  .fill(0)
  .map((_, i) => ({
    change_type: "diff",
    summary: `Summary - ${i}`,
    created_at: new Date(),
    patches: codeSample(i)
  }));

Default.args = { data, isLoading: false };
