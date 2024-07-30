import { ComponentMeta, ComponentStory } from "@storybook/react";
import { EvidenceType } from "../../../../api/types/evidence";
import { sampleIncidentNode } from "../../../../data/sampleIncident";
import { EvidenceSection } from "./index";

export default {
  title: "EvidenceSection",
  component: EvidenceSection,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  decorators: [(Story) => <Story />]
} as ComponentMeta<typeof EvidenceSection>;

const Template: ComponentStory<typeof EvidenceSection> = (arg: any) => (
  <EvidenceSection {...arg} />
);

export const Base = Template.bind({});

Base.args = {
  evidenceList: [
    {
      id: "01816614-2149-460d-ab46-6e61115eb5b0",
      hypothesisId: "f87c055a-7529-47ee-b363-7059c258e135",
      description: "",
      hypothesis_id: "f87c055a-7529-47ee-b363-7059c258e135",
      created_by: {
        id: "01814f6d-edba-8467-55ca-78974a2004f6",
        name: "Galileo Galilei"
      },
      type: EvidenceType.Log,
      evidence: {
        lines: [
          {
            labels: {
              pod: "nginx-ingress-controller-q6md6",
              nodeName: "ip-10-0-6-82.eu-west-2.compute.internal",
              namespace: "ingress-nginx",
              containerName: "nginx-ingress-controller"
            },
            message:
              'W0615 06:35:00.304447       7 controller.go:992] Service "test-foo-4/canary-check-pod" does not have any active Endpoint.',
            timestamp: "2022-06-15T06:35:00.304516056Z"
          },
          {
            labels: {
              pod: "nginx-ingress-controller-q6md6",
              nodeName: "ip-10-0-6-82.eu-west-2.compute.internal",
              namespace: "ingress-nginx",
              containerName: "nginx-ingress-controller"
            },
            message:
              'W0615 06:35:03.636682       7 controller.go:900] Error obtaining Endpoints for Service "default/hello-world-golang-1": no object matching key "default/hello-world-golang-1" in local store',
            timestamp: "2022-06-15T06:35:03.636822185Z"
          },
          {
            labels: {
              pod: "nginx-ingress-controller-q6md6",
              nodeName: "ip-10-0-6-82.eu-west-2.compute.internal",
              namespace: "ingress-nginx",
              containerName: "nginx-ingress-controller"
            },
            message:
              'W0615 06:35:03.636724       7 controller.go:900] Error obtaining Endpoints for Service "default/hello-world-ruby-1": no object matching key "default/hello-world-ruby-1" in local store',
            timestamp: "2022-06-15T06:35:03.636861638Z"
          }
        ]
      },
      properties: undefined,
      created_at: "2022-06-15T06:36:44.232553",
      updated_at: "2022-06-15T06:36:44.232553"
    }
  ],
  hypothesis: sampleIncidentNode,
  titlePrepend: (
    <div className="text-lg font-medium font-semibold text-gray-900">
      Evidence
    </div>
  ),
  onDeleteEvidence: () =>
    new Promise((res) => setTimeout(() => res(true), 3000))
};
