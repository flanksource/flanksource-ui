import { useState } from "react";
import { TopologySelectorModal } from "./TopologySelectorModal";

export default {
  title: "TopologySelectorModal",
  component: TopologySelectorModal
};

const data = [
  {
    name: "cluster",
    id: "017e83b4-719a-4217-abee-4c57f45905d2",
    icon: "kubernetes",
    components: [
      {
        name: "nodes",
        id: "017e83c0-2b1e-bad9-6085-f5a5b32a23a2",
        icon: "server",
        status: "healthy",
        summary: {
          healthy: 3
        },
        components: [
          {
            name: "ip-10-0-6-82.eu-west-2.compute.internal",
            id: "017e83c8-c74c-c6b3-0bdb-8a6cc43982c5",
            icon: "server",
            status: "healthy",
            type: "KubernetesNode",
            summary: {},
            properties: [
              {
                name: "cpu",
                value: 630,
                unit: "millicores",
                max: 3920
              },
              {
                name: "memory",
                value: 13940244480,
                unit: "bytes",
                max: 15554052096
              },
              {
                name: "ephemeral-storage",
                unit: "bytes",
                max: 76224326324
              },
              {
                name: "instance-type",
                text: "t3.xlarge"
              },
              {
                name: "zone",
                text: "eu-west-2c"
              },
              {
                name: "ami"
              },
              {
                name: "operatingSystem",
                text: "linux"
              },
              {
                name: "kernelVersion",
                text: "5.4.129-63.229.amzn2.x86_64"
              },
              {
                name: "osImage",
                text: "Amazon Linux 2"
              },
              {
                name: "containerRuntimeVersion",
                text: "docker://19.3.13"
              },
              {
                name: "kubeProxyVersion",
                text: "v1.20.4-eks-6b7464"
              },
              {
                name: "architecture",
                text: "amd64"
              },
              {
                name: "kubeletVersion",
                text: "v1.20.4-eks-6b7464"
              }
            ],
            created_at: "2022-01-22T21:54:40.587458",
            updated_at: "2022-01-23T07:21:23.452554",
            external_id: "eu-west-2c/ip-10-0-6-82.eu-west-2.compute.internal"
          },
          {
            name: "ip-10-0-6-82.eu-west-2.compute.internal",
            id: "017e83c8-c74c-c6b3-0bdb-8a6cc43982c5",
            icon: "server",
            status: "healthy",
            type: "KubernetesNode",
            summary: {},
            properties: [
              {
                name: "cpu",
                value: 630,
                unit: "millicores",
                max: 3920
              },
              {
                name: "memory",
                value: 13940244480,
                unit: "bytes",
                max: 15554052096
              },
              {
                name: "ephemeral-storage",
                unit: "bytes",
                max: 76224326324
              },
              {
                name: "instance-type",
                text: "t3.xlarge"
              },
              {
                name: "zone",
                text: "eu-west-2c"
              },
              {
                name: "ami"
              },
              {
                name: "operatingSystem",
                text: "linux"
              },
              {
                name: "kernelVersion",
                text: "5.4.129-63.229.amzn2.x86_64"
              },
              {
                name: "osImage",
                text: "Amazon Linux 2"
              },
              {
                name: "containerRuntimeVersion",
                text: "docker://19.3.13"
              },
              {
                name: "kubeProxyVersion",
                text: "v1.20.4-eks-6b7464"
              },
              {
                name: "architecture",
                text: "amd64"
              },
              {
                name: "kubeletVersion",
                text: "v1.20.4-eks-6b7464"
              }
            ],
            created_at: "2022-01-22T21:54:40.587458",
            updated_at: "2022-01-23T07:21:23.452554",
            external_id: "eu-west-2c/ip-10-0-6-82.eu-west-2.compute.internal"
          },
          {
            name: "ip-10-0-6-82.eu-west-2.compute.internal",
            id: "017e83c8-c74c-c6b3-0bdb-8a6cc43982c5",
            icon: "server",
            status: "healthy",
            type: "KubernetesNode",
            summary: {},
            properties: [
              {
                name: "cpu",
                value: 630,
                unit: "millicores",
                max: 3920
              },
              {
                name: "memory",
                value: 13940244480,
                unit: "bytes",
                max: 15554052096
              },
              {
                name: "ephemeral-storage",
                unit: "bytes",
                max: 76224326324
              },
              {
                name: "instance-type",
                text: "t3.xlarge"
              },
              {
                name: "zone",
                text: "eu-west-2c"
              },
              {
                name: "ami"
              },
              {
                name: "operatingSystem",
                text: "linux"
              },
              {
                name: "kernelVersion",
                text: "5.4.129-63.229.amzn2.x86_64"
              },
              {
                name: "osImage",
                text: "Amazon Linux 2"
              },
              {
                name: "containerRuntimeVersion",
                text: "docker://19.3.13"
              },
              {
                name: "kubeProxyVersion",
                text: "v1.20.4-eks-6b7464"
              },
              {
                name: "architecture",
                text: "amd64"
              },
              {
                name: "kubeletVersion",
                text: "v1.20.4-eks-6b7464"
              }
            ],
            created_at: "2022-01-22T21:54:40.587458",
            updated_at: "2022-01-23T07:21:23.452554",
            external_id: "eu-west-2c/ip-10-0-6-82.eu-west-2.compute.internal"
          }
        ],
        created_at: "2022-01-22T21:45:16.317433",
        updated_at: "2022-01-23T07:21:23.44984"
      }
    ],
    properties: [
      {
        name: "dns",
        text: "canary.lab.flanksource.com"
      },
      {
        name: "id",
        type: "hidden",
        text: "arn:aws:eks:eu-west-2:745897381572:cluster/flanksource-canary-cluster"
      },
      {
        name: "name",
        text: "flanksource-canary-cluster"
      },
      {
        name: "account",
        text: "745897381572"
      },
      {
        name: "region",
        text: "eu-west-2"
      },
      {
        name: "RPS",
        text: "165/s",
        headline: true
      },
      {
        name: "Errors",
        text: "0.1%",
        headline: true
      },
      {
        name: "Latency",
        text: "225ms",
        headline: true
      }
    ],
    summary: {},
    status: "healthy",
    created_at: "2022-01-22T21:32:27.921212",
    updated_at: "2022-01-23T07:21:23.44703",
    external_id:
      "arn:aws:eks:eu-west-2:745897381572:cluster/flanksource-canary-cluster"
  },
  {
    name: "cluster",
    id: "017e83b4-719a-4217-abee-4c57f335905d22",
    icon: "kubernetes",
    components: [
      {
        name: "nodes",
        id: "017e83c0-2b1e-bad9-6085-f5a5b32a23a2",
        icon: "server",
        status: "healthy",
        summary: {
          healthy: 3
        },
        components: [
          {
            name: "ip-10-0-6-82.eu-west-2.compute.internal",
            id: "017e83c8-c74c-c6b3-0bdb-8a6cc43982c5",
            icon: "server",
            status: "healthy",
            type: "KubernetesNode",
            summary: {},
            properties: [
              {
                name: "cpu",
                value: 630,
                unit: "millicores",
                max: 3920
              },
              {
                name: "memory",
                value: 13940244480,
                unit: "bytes",
                max: 15554052096
              },
              {
                name: "ephemeral-storage",
                unit: "bytes",
                max: 76224326324
              },
              {
                name: "instance-type",
                text: "t3.xlarge"
              },
              {
                name: "zone",
                text: "eu-west-2c"
              },
              {
                name: "ami"
              },
              {
                name: "operatingSystem",
                text: "linux"
              },
              {
                name: "kernelVersion",
                text: "5.4.129-63.229.amzn2.x86_64"
              },
              {
                name: "osImage",
                text: "Amazon Linux 2"
              },
              {
                name: "containerRuntimeVersion",
                text: "docker://19.3.13"
              },
              {
                name: "kubeProxyVersion",
                text: "v1.20.4-eks-6b7464"
              },
              {
                name: "architecture",
                text: "amd64"
              },
              {
                name: "kubeletVersion",
                text: "v1.20.4-eks-6b7464"
              }
            ],
            created_at: "2022-01-22T21:54:40.587458",
            updated_at: "2022-01-23T07:21:23.452554",
            external_id: "eu-west-2c/ip-10-0-6-82.eu-west-2.compute.internal"
          },
          {
            name: "ip-10-0-6-82.eu-west-2.compute.internal",
            id: "017e83c8-c74c-c6b3-0bdb-8a6cc43982c5",
            icon: "server",
            status: "healthy",
            type: "KubernetesNode",
            summary: {},
            properties: [
              {
                name: "cpu",
                value: 630,
                unit: "millicores",
                max: 3920
              },
              {
                name: "memory",
                value: 13940244480,
                unit: "bytes",
                max: 15554052096
              },
              {
                name: "ephemeral-storage",
                unit: "bytes",
                max: 76224326324
              },
              {
                name: "instance-type",
                text: "t3.xlarge"
              },
              {
                name: "zone",
                text: "eu-west-2c"
              },
              {
                name: "ami"
              },
              {
                name: "operatingSystem",
                text: "linux"
              },
              {
                name: "kernelVersion",
                text: "5.4.129-63.229.amzn2.x86_64"
              },
              {
                name: "osImage",
                text: "Amazon Linux 2"
              },
              {
                name: "containerRuntimeVersion",
                text: "docker://19.3.13"
              },
              {
                name: "kubeProxyVersion",
                text: "v1.20.4-eks-6b7464"
              },
              {
                name: "architecture",
                text: "amd64"
              },
              {
                name: "kubeletVersion",
                text: "v1.20.4-eks-6b7464"
              }
            ],
            created_at: "2022-01-22T21:54:40.587458",
            updated_at: "2022-01-23T07:21:23.452554",
            external_id: "eu-west-2c/ip-10-0-6-82.eu-west-2.compute.internal"
          },
          {
            name: "ip-10-0-6-82.eu-west-2.compute.internal",
            id: "017e83c8-c74c-c6b3-0bdb-8a6cc43982c5",
            icon: "server",
            status: "healthy",
            type: "KubernetesNode",
            summary: {},
            properties: [
              {
                name: "cpu",
                value: 630,
                unit: "millicores",
                max: 3920
              },
              {
                name: "memory",
                value: 13940244480,
                unit: "bytes",
                max: 15554052096
              },
              {
                name: "ephemeral-storage",
                unit: "bytes",
                max: 76224326324
              },
              {
                name: "instance-type",
                text: "t3.xlarge"
              },
              {
                name: "zone",
                text: "eu-west-2c"
              },
              {
                name: "ami"
              },
              {
                name: "operatingSystem",
                text: "linux"
              },
              {
                name: "kernelVersion",
                text: "5.4.129-63.229.amzn2.x86_64"
              },
              {
                name: "osImage",
                text: "Amazon Linux 2"
              },
              {
                name: "containerRuntimeVersion",
                text: "docker://19.3.13"
              },
              {
                name: "kubeProxyVersion",
                text: "v1.20.4-eks-6b7464"
              },
              {
                name: "architecture",
                text: "amd64"
              },
              {
                name: "kubeletVersion",
                text: "v1.20.4-eks-6b7464"
              }
            ],
            created_at: "2022-01-22T21:54:40.587458",
            updated_at: "2022-01-23T07:21:23.452554",
            external_id: "eu-west-2c/ip-10-0-6-82.eu-west-2.compute.internal"
          }
        ],
        created_at: "2022-01-22T21:45:16.317433",
        updated_at: "2022-01-23T07:21:23.44984"
      }
    ],
    properties: [
      {
        name: "dns",
        text: "canary.lab.flanksource.com"
      },
      {
        name: "id",
        type: "hidden",
        text: "arn:aws:eks:eu-west-2:745897381572:cluster/flanksource-canary-cluster"
      },
      {
        name: "name",
        text: "flanksource-canary-cluster"
      },
      {
        name: "account",
        text: "745897381572"
      },
      {
        name: "region",
        text: "eu-west-2"
      },
      {
        name: "RPS",
        text: "165/s",
        headline: true
      },
      {
        name: "Errors",
        text: "0.1%",
        headline: true
      },
      {
        name: "Latency",
        text: "225ms",
        headline: true
      }
    ],
    summary: {},
    status: "healthy",
    created_at: "2022-01-22T21:32:27.921212",
    updated_at: "2022-01-23T07:21:23.44703",
    external_id:
      "arn:aws:eks:eu-west-2:745897381572:cluster/flanksource-canary-cluster"
  },
  {
    name: "cluster",
    id: "017443b4-719a-4217-abee-4c57f45905d2",
    icon: "kubernetes",
    components: [
      {
        name: "nodes",
        id: "017e83c0-2b1e-bad9-6085-f5a5b32a23a2",
        icon: "server",
        status: "healthy",
        summary: {
          healthy: 3
        },
        components: [
          {
            name: "ip-10-0-6-82.eu-west-2.compute.internal",
            id: "017e83c8-c74c-c6b3-0bdb-8a6cc43982c5",
            icon: "server",
            status: "healthy",
            type: "KubernetesNode",
            summary: {},
            properties: [
              {
                name: "cpu",
                value: 630,
                unit: "millicores",
                max: 3920
              },
              {
                name: "memory",
                value: 13940244480,
                unit: "bytes",
                max: 15554052096
              },
              {
                name: "ephemeral-storage",
                unit: "bytes",
                max: 76224326324
              },
              {
                name: "instance-type",
                text: "t3.xlarge"
              },
              {
                name: "zone",
                text: "eu-west-2c"
              },
              {
                name: "ami"
              },
              {
                name: "operatingSystem",
                text: "linux"
              },
              {
                name: "kernelVersion",
                text: "5.4.129-63.229.amzn2.x86_64"
              },
              {
                name: "osImage",
                text: "Amazon Linux 2"
              },
              {
                name: "containerRuntimeVersion",
                text: "docker://19.3.13"
              },
              {
                name: "kubeProxyVersion",
                text: "v1.20.4-eks-6b7464"
              },
              {
                name: "architecture",
                text: "amd64"
              },
              {
                name: "kubeletVersion",
                text: "v1.20.4-eks-6b7464"
              }
            ],
            created_at: "2022-01-22T21:54:40.587458",
            updated_at: "2022-01-23T07:21:23.452554",
            external_id: "eu-west-2c/ip-10-0-6-82.eu-west-2.compute.internal"
          },
          {
            name: "ip-10-0-6-82.eu-west-2.compute.internal",
            id: "017e83c8-c74c-c6b3-0bdb-8a6cc43982c5",
            icon: "server",
            status: "healthy",
            type: "KubernetesNode",
            summary: {},
            properties: [
              {
                name: "cpu",
                value: 630,
                unit: "millicores",
                max: 3920
              },
              {
                name: "memory",
                value: 13940244480,
                unit: "bytes",
                max: 15554052096
              },
              {
                name: "ephemeral-storage",
                unit: "bytes",
                max: 76224326324
              },
              {
                name: "instance-type",
                text: "t3.xlarge"
              },
              {
                name: "zone",
                text: "eu-west-2c"
              },
              {
                name: "ami"
              },
              {
                name: "operatingSystem",
                text: "linux"
              },
              {
                name: "kernelVersion",
                text: "5.4.129-63.229.amzn2.x86_64"
              },
              {
                name: "osImage",
                text: "Amazon Linux 2"
              },
              {
                name: "containerRuntimeVersion",
                text: "docker://19.3.13"
              },
              {
                name: "kubeProxyVersion",
                text: "v1.20.4-eks-6b7464"
              },
              {
                name: "architecture",
                text: "amd64"
              },
              {
                name: "kubeletVersion",
                text: "v1.20.4-eks-6b7464"
              }
            ],
            created_at: "2022-01-22T21:54:40.587458",
            updated_at: "2022-01-23T07:21:23.452554",
            external_id: "eu-west-2c/ip-10-0-6-82.eu-west-2.compute.internal"
          },
          {
            name: "ip-10-0-6-82.eu-west-2.compute.internal",
            id: "017e83c8-c74c-c6b3-0bdb-8a6cc43982c5",
            icon: "server",
            status: "healthy",
            type: "KubernetesNode",
            summary: {},
            properties: [
              {
                name: "cpu",
                value: 630,
                unit: "millicores",
                max: 3920
              },
              {
                name: "memory",
                value: 13940244480,
                unit: "bytes",
                max: 15554052096
              },
              {
                name: "ephemeral-storage",
                unit: "bytes",
                max: 76224326324
              },
              {
                name: "instance-type",
                text: "t3.xlarge"
              },
              {
                name: "zone",
                text: "eu-west-2c"
              },
              {
                name: "ami"
              },
              {
                name: "operatingSystem",
                text: "linux"
              },
              {
                name: "kernelVersion",
                text: "5.4.129-63.229.amzn2.x86_64"
              },
              {
                name: "osImage",
                text: "Amazon Linux 2"
              },
              {
                name: "containerRuntimeVersion",
                text: "docker://19.3.13"
              },
              {
                name: "kubeProxyVersion",
                text: "v1.20.4-eks-6b7464"
              },
              {
                name: "architecture",
                text: "amd64"
              },
              {
                name: "kubeletVersion",
                text: "v1.20.4-eks-6b7464"
              }
            ],
            created_at: "2022-01-22T21:54:40.587458",
            updated_at: "2022-01-23T07:21:23.452554",
            external_id: "eu-west-2c/ip-10-0-6-82.eu-west-2.compute.internal"
          }
        ],
        created_at: "2022-01-22T21:45:16.317433",
        updated_at: "2022-01-23T07:21:23.44984"
      }
    ],
    properties: [
      {
        name: "dns",
        text: "canary.lab.flanksource.com"
      },
      {
        name: "id",
        type: "hidden",
        text: "arn:aws:eks:eu-west-2:745897381572:cluster/flanksource-canary-cluster"
      },
      {
        name: "name",
        text: "flanksource-canary-cluster"
      },
      {
        name: "account",
        text: "745897381572"
      },
      {
        name: "region",
        text: "eu-west-2"
      },
      {
        name: "RPS",
        text: "165/s",
        headline: true
      },
      {
        name: "Errors",
        text: "0.1%",
        headline: true
      },
      {
        name: "Latency",
        text: "225ms",
        headline: true
      }
    ],
    summary: {},
    status: "healthy",
    created_at: "2022-01-22T21:32:27.921212",
    updated_at: "2022-01-23T07:21:23.44703",
    external_id:
      "arn:aws:eks:eu-west-2:745897381572:cluster/flanksource-canary-cluster"
  }
];

const Template = (arg) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  return (
    <>
      <button
        className="btn-primary"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        show modal
      </button>
      <TopologySelectorModal
        isOpen={isOpen}
        handleModalClose={handleClose}
        {...arg}
      />
    </>
  );
};

export const Variant1 = Template.bind({});
Variant1.args = {
  topologies: data,
  title: "Add Card",
  submitButtonTitle: "Add",
  onSubmit: () => alert("submit"),
  defaultChecked: [data[0].id]
};
