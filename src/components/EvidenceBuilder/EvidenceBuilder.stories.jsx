import { EvidenceBuilder } from "./index";

// export default required by storybook
// eslint-disable-next-line import/no-default-export
export default {
  title: "EvidenceBuilder",
  component: EvidenceBuilder
};

const Template = (arg) => <EvidenceBuilder {...arg} />;

export const Variant1 = Template.bind({});
