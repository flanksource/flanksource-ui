import { EvidenceLogList } from "./EvidenceLogList";

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
