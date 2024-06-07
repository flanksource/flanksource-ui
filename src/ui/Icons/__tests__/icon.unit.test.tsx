/* eslint-disable jest/valid-title */
/* eslint-disable testing-library/await-async-query */
import { aliases, findByName } from "../Icon";

describe("Icon", () => {
  let tests = [
    "Kubernetes::Elasticsearch",
    "Kubernetes::CNINode",
    "Kubernetes::Cluster",
    "AWS::IAM::InstanceProfile",
    "Kubernetes::LoggingBackend",
    "Kubernetes::SealedSecret",
    "Kubernetes::Application",
    "Kubernetes::AppProject",
    "Kubernetes::FlowSchema",
    "Kubernetes::PriorityClass",
    "Kubernetes::PriorityLevelConfiguration",
    "Kubernetes::Provider"
  ];
  tests.forEach((item) => {
    fit(item, () => {
      expect(findByName(item)).not.toBeNull();
    });
  });

  for (const item in aliases) {
    fit(item, () => {
      expect(findByName(item)).not.toBeNull();
    });
  }
});
