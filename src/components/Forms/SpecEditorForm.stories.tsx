import { Story } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import React, { ComponentProps } from "react";
import YAML from "yaml";
import { schemaResourceTypes } from "../SchemaResourcePage/resourceTypes";
import AWSConfigsFormEditor from "./Configs/AWSConfigsFormEditor";
import HttpConfigsFormEditor from "./Configs/HttpConfigsFormEditor";
import KubernetesConfigsFormEditor from "./Configs/KubernetesConfigsFormEditor";
import { HTTPHealthFormEditor } from "./Health/HTTPHealthFormEditor";
import SpecEditorForm from "./SpecEditorForm";

const catalogScraper = YAML.parse(`apiVersion: configs.flanksource.com/v1
kind: ScrapeConfig
metadata:
  name: lastfm-scraper
  namespace: mc
spec:
  http:
    - type: 'LastFM::Singer'
      name: '$.name'
      id: '$.url'
      env:
        - name: api_key
          valueFrom:
            secretKeyRef:
              name: lastfm
              key: API_KEY
      url: 'http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key={{.api_key}}&format=json'
      transform:
        expr: |
          dyn(config).artists.artist.map(item, item).toJSON()
`);

export default {
  title: "SpecEditorForm",
  component: SpecEditorForm,
  decorators: [
    (Story: React.FC) => (
      <div className="h-screen w-screen overflow-y-auto p-4">
        <Story />
      </div>
    )
  ]
};

const Template = (args: ComponentProps<typeof SpecEditorForm>) => (
  <SpecEditorForm {...args} />
);

export const KubernetesSpecEditorFormConfigs: Story<
  ComponentProps<typeof SpecEditorForm>
> = Template.bind({});

KubernetesSpecEditorFormConfigs.args = {
  updateSpec(spec) {
    console.log(spec);
  },
  selectedSpec: {
    configForm: KubernetesConfigsFormEditor,
    icon: "kubernetes",
    label: "Kubernetes",
    loadSpec: () => {
      return {};
    },
    type: "form",
    name: "kubernetes",
    schemaFileName: undefined,
    specsMapField: "kubernetes.0",
    updateSpec: () => {}
  },
  resourceInfo: schemaResourceTypes[2]
};

export const AWSSpecEditorFormConfigs: Story<
  ComponentProps<typeof SpecEditorForm>
> = Template.bind({});

AWSSpecEditorFormConfigs.args = {
  updateSpec(spec) {
    console.log(spec);
  },
  selectedSpec: {
    configForm: AWSConfigsFormEditor,
    icon: "kubernetes",
    label: "Kubernetes",
    loadSpec: () => {
      return {};
    },
    type: "form",
    name: "kubernetes",
    schemaFileName: undefined,
    specsMapField: "kubernetes.0",
    updateSpec: () => {}
  },
  resourceInfo: schemaResourceTypes[2]
};

export const HTTPHealthFormEditorConfigs: Story<
  ComponentProps<typeof SpecEditorForm>
> = Template.bind({});

HTTPHealthFormEditorConfigs.args = {
  updateSpec(spec) {
    console.log(spec);
  },
  selectedSpec: {
    configForm: HTTPHealthFormEditor,
    icon: "kubernetes",
    label: "Kubernetes",
    loadSpec: () => {
      return {};
    },
    type: "form",
    name: "kubernetes",
    schemaFileName: undefined,
    specsMapField: "kubernetes.0",
    updateSpec: () => {}
  },
  resourceInfo: schemaResourceTypes.at(-1)
};

export const CatalogScraperCodeTab: Story<
  ComponentProps<typeof SpecEditorForm>
> = Template.bind({});

CatalogScraperCodeTab.args = {
  loadSpec: () => ({
    name: catalogScraper.metadata.name,
    source: "UI",
    spec: catalogScraper.spec
  }),
  selectedSpec: {
    configForm: HttpConfigsFormEditor,
    icon: "http",
    label: "HTTP",
    loadSpec: () => ({}),
    type: "form",
    name: "http",
    schemaFileName: undefined,
    specsMapField: "http.0",
    updateSpec: () => {}
  },
  resourceInfo: schemaResourceTypes.find(
    ({ table }) => table === "config_scrapers"
  )
};

CatalogScraperCodeTab.play = async ({ canvasElement }) => {
  await userEvent.click(within(canvasElement).getByText("Code"));
};
