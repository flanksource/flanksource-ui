import { ComponentMeta, ComponentStory } from "@storybook/react";
import { LogsViewer } from "./index";
import LogItem from "@flanksource-ui/types/Logs";

export default {
  title: "LogsViewer",
  component: LogsViewer,
  decorators: [(Story) => <Story />]
} as ComponentMeta<typeof LogsViewer>;

const logsExample: LogItem[] = [
  {
    timestamp: "2022-04-14T11:49:12.705934543Z",
    message:
      "W0414 11:49:12.705797       1 warnings.go:67] extensions/v1beta1 Ingress is deprecated in v1.14+, unavailable in v1.22+; use networking.k8s.io/v1 Ingress",
    labels: {
      containerName: "cert-manager",
      namespace: "cert-manager",
      nodeName: "ip-10-0-6-82.eu-west-2.compute.internal",
      pod: "cert-manager-55c7f45676-ldt2x"
    }
  },
  {
    timestamp: "2022-04-14T11:56:31.562Z",
    message:
      "\u001b[34mINFO\u001b[0m\tcontrollers.canary\tFAIL [http] dev/abp-microservice/ABP Microservices demo public website duration=32  response code invalid 503 != [200]",
    labels: {
      containerName: "canary-checker",
      namespace: "demo",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "canary-checker-5d484488bf-sxbpb"
    }
  },
  {
    timestamp: "2022-04-14T11:56:55.581Z",
    message:
      '\u001b[35mDEBUG\u001b[0m\tcontroller-runtime.manager.events\tWarning\t{"object": {"kind":"Canary","namespace":"prod","name":"abp-microservice","uid":"e821fd8a-ca3f-448e-bd16-2b4003444128","apiVersion":"canaries.flanksource.com/v1","resourceVersion":"234790132"}, "reason": "Failed", "message": "http-https://abp-sample-admin-prod.canary.lab.flanksource.com: "}',
    labels: {
      containerName: "canary-checker",
      namespace: "demo",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "canary-checker-5d484488bf-sxbpb"
    }
  },
  {
    timestamp: "2022-04-14T11:49:12.705934543Z",
    message:
      "W0414 11:49:12.705797       1 warnings.go:67] extensions/v1beta1 Ingress is deprecated in v1.14+, unavailable in v1.22+; use networking.k8s.io/v1 Ingress",
    labels: {
      containerName: "cert-manager",
      namespace: "cert-manager",
      nodeName: "ip-10-0-6-82.eu-west-2.compute.internal",
      pod: "cert-manager-55c7f45676-ldt2x"
    }
  },
  {
    timestamp: "2022-04-14T11:56:31.562Z",
    message:
      "\u001b[34mINFO\u001b[0m\tcontrollers.canary\tFAIL [http] dev/abp-microservice/ABP Microservices demo public website duration=32  response code invalid 503 != [200]",
    labels: {
      containerName: "canary-checker",
      namespace: "demo",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "canary-checker-5d484488bf-sxbpb"
    }
  },
  {
    timestamp: "2022-04-14T11:56:55.581Z",
    message:
      '\u001b[35mDEBUG\u001b[0m\tcontroller-runtime.manager.events\tWarning\t{"object": {"kind":"Canary","namespace":"prod","name":"abp-microservice","uid":"e821fd8a-ca3f-448e-bd16-2b4003444128","apiVersion":"canaries.flanksource.com/v1","resourceVersion":"234790132"}, "reason": "Failed", "message": "http-https://abp-sample-admin-prod.canary.lab.flanksource.com: "}',
    labels: {
      containerName: "canary-checker",
      namespace: "demo",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "canary-checker-5d484488bf-sxbpb"
    }
  },
  {
    timestamp: "2022-04-14T11:49:12.705934543Z",
    message:
      "W0414 11:49:12.705797       1 warnings.go:67] extensions/v1beta1 Ingress is deprecated in v1.14+, unavailable in v1.22+; use networking.k8s.io/v1 Ingress",
    labels: {
      containerName: "cert-manager",
      namespace: "cert-manager",
      nodeName: "ip-10-0-6-82.eu-west-2.compute.internal",
      pod: "cert-manager-55c7f45676-ldt2x"
    }
  },
  {
    timestamp: "2022-04-14T11:56:31.562Z",
    message:
      "\u001b[34mINFO\u001b[0m\tcontrollers.canary\tFAIL [http] dev/abp-microservice/ABP Microservices demo public website duration=32  response code invalid 503 != [200]",
    labels: {
      containerName: "canary-checker",
      namespace: "demo",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "canary-checker-5d484488bf-sxbpb"
    }
  },
  {
    timestamp: "2022-04-14T11:56:55.581Z",
    message:
      '\u001b[35mDEBUG\u001b[0m\tcontroller-runtime.manager.events\tWarning\t{"object": {"kind":"Canary","namespace":"prod","name":"abp-microservice","uid":"e821fd8a-ca3f-448e-bd16-2b4003444128","apiVersion":"canaries.flanksource.com/v1","resourceVersion":"234790132"}, "reason": "Failed", "message": "http-https://abp-sample-admin-prod.canary.lab.flanksource.com: "}',
    labels: {
      containerName: "canary-checker",
      namespace: "demo",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "canary-checker-5d484488bf-sxbpb"
    }
  },
  {
    timestamp: "2022-04-14T11:49:12.705934543Z",
    message:
      "W0414 11:49:12.705797       1 warnings.go:67] extensions/v1beta1 Ingress is deprecated in v1.14+, unavailable in v1.22+; use networking.k8s.io/v1 Ingress",
    labels: {
      containerName: "cert-manager",
      namespace: "cert-manager",
      nodeName: "ip-10-0-6-82.eu-west-2.compute.internal",
      pod: "cert-manager-55c7f45676-ldt2x"
    }
  },
  {
    timestamp: "2022-04-14T11:56:31.562Z",
    message:
      "\u001b[34mINFO\u001b[0m\tcontrollers.canary\tFAIL [http] dev/abp-microservice/ABP Microservices demo public website duration=32  response code invalid 503 != [200]",
    labels: {
      containerName: "canary-checker",
      namespace: "demo",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "canary-checker-5d484488bf-sxbpb"
    }
  },
  {
    timestamp: "2022-04-14T11:56:55.581Z",
    message:
      '\u001b[35mDEBUG\u001b[0m\tcontroller-runtime.manager.events\tWarning\t{"object": {"kind":"Canary","namespace":"prod","name":"abp-microservice","uid":"e821fd8a-ca3f-448e-bd16-2b4003444128","apiVersion":"canaries.flanksource.com/v1","resourceVersion":"234790132"}, "reason": "Failed", "message": "http-https://abp-sample-admin-prod.canary.lab.flanksource.com: "}',
    labels: {
      containerName: "canary-checker",
      namespace: "demo",
      nodeName: "ip-10-0-5-82.eu-west-2.compute.internal",
      pod: "canary-checker-5d484488bf-sxbpb"
    }
  }
];

const Template: ComponentStory<typeof LogsViewer> = (arg) => (
  <LogsViewer {...arg} />
);

export const Variant1 = Template.bind({});
Variant1.args = {
  logs: logsExample,
  componentId: "123456"
};
