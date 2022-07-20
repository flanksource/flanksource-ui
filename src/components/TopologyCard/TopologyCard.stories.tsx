import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { CardSize, TopologyCard } from "./index";

export default {
  title: "TopologyCard",
  component: TopologyCard,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    )
  ]
} as ComponentMeta<typeof TopologyCard>;

const topology = {
  name: "abp",
  id: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
  text: "ABP Microservices",
  topology_type: "component",
  namespace: "dev",
  labels: {
    environment: "dev",
    "kustomize.toolkit.fluxcd.io/name": "aws-sandbox",
    "kustomize.toolkit.fluxcd.io/namespace": "flux-system"
  },
  icon: "dotnet",
  status: "unknown",
  type: "DotnetApplication",
  summary: {},
  properties: [
    {
      icon: "world",
      type: "url",
      text: "https://docs.abp.io/en/abp/latest/Samples/Microservice-Demo"
    },
    {
      icon: "aws",
      text: "eu-west-2"
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
      topology_type: "component",
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
      system_template_id: "01818abb-1d07-e0c6-cbe0-6b3b702039a5",
      created_at: "2022-07-18T15:49:42.124908Z",
      updated_at: "2022-07-18T15:49:42.124908Z",
      deleted_at: null,
      external_id: "Auth Server"
    },
    {
      name: "Website",
      id: "01821200-3e8d-a787-89cc-49c9bc6841ec",
      topology_type: "component",
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
      system_template_id: "01818abb-1d07-e0c6-cbe0-6b3b702039a5",
      created_at: "2022-07-18T15:49:42.157617Z",
      updated_at: "2022-07-18T15:49:42.157617Z",
      deleted_at: null,
      external_id: "Website"
    },
    {
      name: "Redis",
      id: "01821200-3e93-0df7-f6ce-703a52423827",
      topology_type: "component",
      labels: {
        environment: "dev",
        "kustomize.toolkit.fluxcd.io/name": "aws-sandbox",
        "kustomize.toolkit.fluxcd.io/namespace": "flux-system"
      },
      icon: "redis",
      path: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      type: "Application",
      summary: {},
      parent_id: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      system_template_id: "01818abb-1d07-e0c6-cbe0-6b3b702039a5",
      created_at: "2022-07-18T15:49:42.163406Z",
      updated_at: "2022-07-18T15:49:42.163406Z",
      deleted_at: null,
      external_id: "Redis"
    },
    {
      name: "RabbitMQ",
      id: "01821200-3e98-cdd5-f081-bc3f93476705",
      topology_type: "component",
      labels: {
        environment: "dev",
        "kustomize.toolkit.fluxcd.io/name": "aws-sandbox",
        "kustomize.toolkit.fluxcd.io/namespace": "flux-system"
      },
      icon: "rabbitmq",
      path: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      type: "Application",
      summary: {},
      parent_id: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      system_template_id: "01818abb-1d07-e0c6-cbe0-6b3b702039a5",
      created_at: "2022-07-18T15:49:42.169415Z",
      updated_at: "2022-07-18T15:49:42.169415Z",
      deleted_at: null,
      external_id: "RabbitMQ"
    },
    {
      name: "Mongo",
      id: "01821200-3e9f-d054-115a-c818bf42168a",
      topology_type: "component",
      labels: {
        environment: "dev",
        "kustomize.toolkit.fluxcd.io/name": "aws-sandbox",
        "kustomize.toolkit.fluxcd.io/namespace": "flux-system"
      },
      icon: "mongo",
      path: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      type: "Application",
      summary: {},
      parent_id: "01821200-3e60-0dbb-7ef3-58e1635bc8a6",
      system_template_id: "01818abb-1d07-e0c6-cbe0-6b3b702039a5",
      created_at: "2022-07-18T15:49:42.175625Z",
      updated_at: "2022-07-18T15:49:42.175625Z",
      deleted_at: null,
      external_id: "Mongo"
    },
    {
      name: "Backend Admin",
      id: "01821200-3e73-2612-7bed-623aba12935c",
      topology_type: "component",
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
      system_template_id: "01818abb-1d07-e0c6-cbe0-6b3b702039a5",
      created_at: "2022-07-18T15:49:42.131378Z",
      updated_at: "2022-07-18T15:49:42.131378Z",
      deleted_at: null,
      external_id: "Backend Admin"
    },
    {
      name: "Blogging Service",
      id: "01821200-3e7a-91aa-bd3e-b95147d33c9f",
      topology_type: "component",
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
      system_template_id: "01818abb-1d07-e0c6-cbe0-6b3b702039a5",
      created_at: "2022-07-18T15:49:42.138489Z",
      updated_at: "2022-07-18T15:49:42.138489Z",
      deleted_at: null,
      external_id: "Blogging Service"
    },
    {
      name: "Identity Service",
      id: "01821200-3e80-1713-425c-2cecf97a8f1f",
      topology_type: "component",
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
      system_template_id: "01818abb-1d07-e0c6-cbe0-6b3b702039a5",
      created_at: "2022-07-18T15:49:42.14447Z",
      updated_at: "2022-07-18T15:49:42.14447Z",
      deleted_at: null,
      external_id: "Identity Service"
    },
    {
      name: "Product Service",
      id: "01821200-3e87-9569-3b9a-4e501ba092e9",
      topology_type: "component",
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
      system_template_id: "01818abb-1d07-e0c6-cbe0-6b3b702039a5",
      created_at: "2022-07-18T15:49:42.151638Z",
      updated_at: "2022-07-18T15:49:42.151638Z",
      deleted_at: null,
      external_id: "Product Service"
    },
    {
      name: "SQL Server",
      id: "01821200-3ea6-5708-843b-d84222a4d42d",
      topology_type: "component",
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
      system_template_id: "01818abb-1d07-e0c6-cbe0-6b3b702039a5",
      created_at: "2022-07-18T15:49:42.183071Z",
      updated_at: "2022-07-18T15:49:42.183071Z",
      deleted_at: null,
      external_id: "SQL Server"
    }
  ],
  system_template_id: "01818abb-1d07-e0c6-cbe0-6b3b702039a5",
  created_at: "2022-07-18T15:49:42.112918Z",
  updated_at: "2022-07-18T15:49:42.112918Z",
  deleted_at: null
};

const Template: ComponentStory<typeof TopologyCard> = (arg: any) => {
  return Object.keys(CardSize).map((size) => (
    <TopologyCard {...arg} size={size} />
  ));
};

export const Base = Template.bind({});
Base.args = {
  topology: topology
};
