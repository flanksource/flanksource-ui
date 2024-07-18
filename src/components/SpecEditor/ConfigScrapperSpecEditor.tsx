import { useMemo } from "react";
import { FaCog } from "react-icons/fa";
import AWSConfigsFormEditor from "../Forms/Configs/AWSConfigsFormEditor";
import AzureConfigsFormEditor from "../Forms/Configs/AzureConfigsFormEditor";
import AzureDevopsConfigsFormEditor from "../Forms/Configs/AzureDevopsConfigsFormEditor";
import FileConfigsFormEditor from "../Forms/Configs/FileConfigsFormEditor";
import GithubActionsConfigsFormEditor from "../Forms/Configs/GithubActionsConfigsFormEditor";
import HttpConfigsFormEditor from "../Forms/Configs/HttpConfigsFormEditor";
import KubernetesConfigsFormEditor from "../Forms/Configs/KubernetesConfigsFormEditor";
import KubernetesFileConfigsFormEditor from "../Forms/Configs/KubernetesFileConfigsFormEditor";
import SQLConfigsFormEditor from "../Forms/Configs/SQLConfigsFormEditor";
import TrivyConfigsFormEditor from "../Forms/Configs/TrivyConfigsFormEditor";
import { SchemaResourceType } from "../SchemaResourcePage/resourceTypes";
import SpecEditor, { SpecType } from "./SpecEditor";

const resourceInfo: Pick<SchemaResourceType, "api" | "table" | "name"> = {
  name: "Catalog Scraper",
  api: "config-db",
  table: "config_scrapers"
};

type ConfigScrapperSpecEditorProps = {
  resourceValue?: Record<string, any>;
  onSubmit?: (spec: Record<string, any>) => void;
  onBack?: () => void;
  onDeleted?: () => void;
};

export default function ConfigScrapperSpecEditor({
  resourceValue,
  onSubmit = () => {},
  onBack,
  onDeleted = () => {}
}: ConfigScrapperSpecEditorProps) {
  const configTypes: SpecType[] = useMemo(
    () =>
      (
        [
          {
            type: "form",
            name: "kubernetes",
            label: "Kubernetes",
            description: "Edit kubernetes configs",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              // probably need to query the spec from the backend
              return resourceValue ?? {};
            },
            icon: "kubernetes",
            configForm: KubernetesConfigsFormEditor,
            specsMapField: "kubernetes.0",
            schemaFileName: "config_kubernetes.schema.json",
            docsLink:
              "https://docs.flanksource.com/config-db/scrapers/kubernetes"
          },
          {
            type: "form",
            name: "azure",
            label: "Azure",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "azure",
            configForm: AzureConfigsFormEditor,
            specsMapField: "azure.0",
            schemaFileName: "config_azure.schema.json",
            docsLink: "https://docs.flanksource.com/config-db/scrapers/azure"
          },
          {
            type: "form",
            name: "kubernetesFile",
            label: "Kubernetes File",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "kubernetes",
            configForm: KubernetesFileConfigsFormEditor,
            specsMapField: "kubernetesFile.0",
            schemaFileName: "config_kubernetesfile.schema.json",
            docsLink:
              "https://docs.flanksource.com/config-db/scrapers/kubernetes-file"
          },
          {
            type: "form",
            name: "sql",
            label: "SQL",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "sql",
            configForm: SQLConfigsFormEditor,
            specsMapField: "sql.0",
            schemaFileName: "config_sql.schema.json",
            docsLink: "https://docs.flanksource.com/config-db/scrapers/sql"
          },
          {
            type: "form",
            name: "trivy",
            label: "Trivy",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "trivy",
            configForm: TrivyConfigsFormEditor,
            specsMapField: "trivy.0",
            schemaFileName: "config_trivy.schema.json",
            docsLink: "https://docs.flanksource.com/config-db/scrapers/trivy"
          },
          {
            type: "form",
            name: "aws",
            label: "AWS",
            description: "Edit aws configs",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              // probably need to query the spec from the backend
              return resourceValue ?? {};
            },
            configForm: AWSConfigsFormEditor,
            icon: "aws",
            specsMapField: "aws.0",
            schemaFileName: "config_aws.schema.json",
            docsLink: "https://docs.flanksource.com/config-db/scrapers/aws"
          },
          {
            type: "form",
            name: "file",
            label: "File",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "folder",
            configForm: FileConfigsFormEditor,
            specsMapField: "file.0",
            schemaFileName: "config_file.schema.json",
            docsLink: "https://docs.flanksource.com/config-db/scrapers/file"
          },
          {
            type: "form",
            name: "githubActions",
            label: "Github Actions",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "git",
            configForm: GithubActionsConfigsFormEditor,
            specsMapField: "githubActions.0",
            schemaFileName: "config_githubactions.schema.json"
          },
          {
            type: "form",
            name: "http",
            label: "HTTP",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "http",
            configForm: HttpConfigsFormEditor,
            specsMapField: "http.0",
            schemaFileName: undefined
          },
          {
            type: "form",
            name: "azureDevops",
            label: "Azure DevOps",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "azure-devops",
            configForm: AzureDevopsConfigsFormEditor,
            specsMapField: "azureDevops.0",
            schemaFileName: "config_azuredevops.schema.json",
            docsLink:
              "https://docs.flanksource.com/config-db/scrapers/azure-devops"
          },
          {
            type: "custom",
            name: "custom",
            label: "Custom",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: FaCog,
            schemaFileName: "scrape_config.spec.schema.json",
            docsLink: "https://docs.flanksource.com/config-db/scrapers/custom"
          }
        ] satisfies SpecType[]
      ).sort((a, b) => a.label.localeCompare(b.label)),
    [onSubmit, resourceValue]
  );

  // there should only be one spec, so we can just grab the first key that isn't
  // schedule, otherwise we'll just use custom
  const selectedSpec = resourceValue?.spec
    ? (Object.keys(resourceValue?.spec).filter(
        (key) => key !== "schedule" && key !== "retention"
      )[0] ?? "custom")
    : undefined;

  return (
    <SpecEditor
      types={configTypes}
      format="yaml"
      resourceInfo={resourceInfo}
      selectedSpec={selectedSpec}
      onBack={onBack}
      onDeleted={onDeleted}
    />
  );
}
