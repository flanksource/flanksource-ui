import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Topology } from "../../../api/types/topology";
import { Size } from "../../../types";
import { TopologyCard } from "./TopologyCard";

export default {
  title: "TopologyCard",
  component: TopologyCard,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  decorators: [(Story) => <Story />]
} as ComponentMeta<typeof TopologyCard>;

const topology: Topology = {
  name: "abp",
  id: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
  text: "ABP Microservices",
  type: "component",
  namespace: "dev",
  labels: {
    environment: "dev",
    "kustomize.toolkit.fluxcd.io/name": "aws-sandbox",
    "kustomize.toolkit.fluxcd.io/namespace": "flux-system"
  },
  icon: "dotnet",
  status: "unknown",
  summary: {},
  properties: [
    {
      icon: "world",
      type: "url",
      text: "https://docs.abp.io/en/abp/latest/Samples/Microservice-Demo",
      name: "Documentation"
    },
    {
      icon: "aws",
      text: "eu-west-2",
      name: "Region"
    },
    {
      name: "Products",
      headline: true,
      text: "112"
    },
    {
      name: "Blogs",
      headline: true,
      text: "15"
    },
    {
      name: "Visitors",
      color: "red",
      headline: true,
      text: "26"
    }
  ],
  components: [
    {
      name: "Auth Server",
      id: "01821200-3e6c-7cf0-ad2a-7ed31a924c25",
      type: "component",
      labels: {
        environment: "dev",
        "kustomize.toolkit.fluxcd.io/name": "aws-sandbox",
        "kustomize.toolkit.fluxcd.io/namespace": "flux-system"
      },
      icon: "dotnet",
      path: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      summary: {},
      parent_id: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      created_at: "2022-07-18T15:49:42.124908Z",
      updated_at: "2022-07-18T15:49:42.124908Z",
      external_id: "Auth Server"
    },
    {
      name: "Website",
      id: "01821200-3e8d-a787-89cc-49c9bc6841ec",
      type: "component",
      labels: {
        environment: "dev",
        "kustomize.toolkit.fluxcd.io/name": "aws-sandbox",
        "kustomize.toolkit.fluxcd.io/namespace": "flux-system"
      },
      icon: "dotnet",
      path: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      summary: {},
      parent_id: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      created_at: "2022-07-18T15:49:42.157617Z",
      updated_at: "2022-07-18T15:49:42.157617Z",
      external_id: "Website"
    },
    {
      name: "Redis",
      id: "01821200-3e93-0df7-f6ce-703a52423827",
      type: "component",
      labels: {
        environment: "dev",
        "kustomize.toolkit.fluxcd.io/name": "aws-sandbox",
        "kustomize.toolkit.fluxcd.io/namespace": "flux-system"
      },
      icon: "redis",
      path: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      summary: {},
      parent_id: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      created_at: "2022-07-18T15:49:42.163406Z",
      updated_at: "2022-07-18T15:49:42.163406Z",
      external_id: "Redis"
    },
    {
      name: "RabbitMQ",
      id: "01821200-3e98-cdd5-f081-bc3f93476705",
      type: "component",
      labels: {
        environment: "dev",
        "kustomize.toolkit.fluxcd.io/name": "aws-sandbox",
        "kustomize.toolkit.fluxcd.io/namespace": "flux-system"
      },
      icon: "rabbitmq",
      path: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      summary: {},
      parent_id: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      created_at: "2022-07-18T15:49:42.169415Z",
      updated_at: "2022-07-18T15:49:42.169415Z",
      external_id: "RabbitMQ"
    },
    {
      name: "Mongo",
      id: "01821200-3e9f-d054-115a-c818bf42168a",
      type: "component",
      labels: {
        environment: "dev",
        "kustomize.toolkit.fluxcd.io/name": "aws-sandbox",
        "kustomize.toolkit.fluxcd.io/namespace": "flux-system"
      },
      icon: "mongo",
      path: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      summary: {},
      parent_id: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      created_at: "2022-07-18T15:49:42.175625Z",
      updated_at: "2022-07-18T15:49:42.175625Z",
      external_id: "Mongo"
    },
    {
      name: "Backend Admin",
      id: "01821200-3e73-2612-7bed-623aba12935c",
      type: "component",
      labels: {
        environment: "dev",
        "kustomize.toolkit.fluxcd.io/name": "aws-sandbox",
        "kustomize.toolkit.fluxcd.io/namespace": "flux-system"
      },
      icon: "dotnet",
      path: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      summary: {},
      parent_id: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      created_at: "2022-07-18T15:49:42.131378Z",
      updated_at: "2022-07-18T15:49:42.131378Z",
      external_id: "Backend Admin"
    },
    {
      name: "Blogging Service",
      id: "01821200-3e7a-91aa-bd3e-b95147d33c9f",
      type: "component",
      labels: {
        environment: "dev",
        "kustomize.toolkit.fluxcd.io/name": "aws-sandbox",
        "kustomize.toolkit.fluxcd.io/namespace": "flux-system"
      },
      icon: "dotnet",
      path: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      summary: {},
      parent_id: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      created_at: "2022-07-18T15:49:42.138489Z",
      updated_at: "2022-07-18T15:49:42.138489Z",
      external_id: "Blogging Service"
    },
    {
      name: "Identity Service",
      id: "01821200-3e80-1713-425c-2cecf97a8f1f",
      type: "component",
      labels: {
        environment: "dev",
        "kustomize.toolkit.fluxcd.io/name": "aws-sandbox",
        "kustomize.toolkit.fluxcd.io/namespace": "flux-system"
      },
      icon: "dotnet",
      path: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      summary: {},
      parent_id: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      created_at: "2022-07-18T15:49:42.14447Z",
      updated_at: "2022-07-18T15:49:42.14447Z",
      external_id: "Identity Service"
    },
    {
      name: "Product Service",
      id: "01821200-3e87-9569-3b9a-4e501ba092e9",
      labels: {
        environment: "dev",
        "kustomize.toolkit.fluxcd.io/name": "aws-sandbox",
        "kustomize.toolkit.fluxcd.io/namespace": "flux-system"
      },
      icon: "dotnet",
      path: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      type: "Application",
      summary: {},
      parent_id: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      created_at: "2022-07-18T15:49:42.151638Z",
      updated_at: "2022-07-18T15:49:42.151638Z",
      external_id: "Product Service"
    },
    {
      name: "SQL Server",
      id: "01821200-3ea6-5708-843b-d84222a4d42d",
      labels: {
        environment: "dev",
        "kustomize.toolkit.fluxcd.io/name": "aws-sandbox",
        "kustomize.toolkit.fluxcd.io/namespace": "flux-system"
      },
      icon: "sqlserver",
      path: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      type: "Application",
      summary: {},
      parent_id: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      created_at: "2022-07-18T15:49:42.183071Z",
      updated_at: "2022-07-18T15:49:42.183071Z",
      external_id: "SQL Server"
    }
  ],
  created_at: "2022-07-18T15:49:42.112918Z",
  updated_at: "2022-07-18T15:49:42.112918Z"
};

const Template: ComponentStory<typeof TopologyCard> = (arg: any) => {
  return (
    <>
      {Object.keys(Size).map((size) => (
        <TopologyCard key={size} {...arg} size={size} />
      ))}
    </>
  );
};

export const Base = Template.bind({});
Base.args = {
  topology: topology
};
