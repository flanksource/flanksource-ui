import { EvidenceLogList } from "./EvidenceLogList";

// export default required by storybook
// eslint-disable-next-line import/no-default-export
export default {
  title: "EvidenceLogList",
  component: EvidenceLogList
};

const Template = (arg) => <EvidenceLogList {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  evidence: {
    id: "12",
    created_at: new Date(),
    description:
      "desc desc desc desc desc desc desc desc desc desc desc desc desc desc"
  }
};
