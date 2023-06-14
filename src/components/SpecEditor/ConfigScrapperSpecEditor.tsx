import { useMemo } from "react";
import SpecEditor, { SpecType } from "./SpecEditor";
import AWSConfigsFormEditor from "../Forms/Configs/AWSConfigsFormEditor";
import KubernetesConfigsFormEditor from "../Forms/Configs/KubernetesConfigsFormEditor";
import { FaCog } from "react-icons/fa";
import { SchemaResourceType } from "../SchemaResourcePage/resourceTypes";
import KubernetesFileConfigsFormEditor from "../Forms/Configs/KubernetesFileConfigsFormEditor";
import SQLConfigsFormEditor from "../Forms/Configs/SQLConfigsFormEditor";
import TrivyConfigsFormEditor from "../Forms/Configs/TrivyConfigsFormEditor";
import AzureConfigsFormEditor from "../Forms/Configs/AzureConfigsFormEditor";
import GithubActionsConfigsFormEditor from "../Forms/Configs/GithubActionsConfigsFormEditor";
import FileConfigsFormEditor from "../Forms/Configs/FileConfigsFormEditor";
import HttpConfigsFormEditor from "../Forms/Configs/HttpConfigsFormEditor";
import AzureDevopsConfigsFormEditor from "../Forms/Configs/AzureDevopsConfigsFormEditor";

type ConfigScrapperSpecEditorProps = {
  resourceValue?: Record<string, any>;
  onSubmit?: (spec: Record<string, any>) => void;
  resourceInfo: SchemaResourceType;
};

export default function ConfigScrapperSpecEditor({
  resourceValue,
  onSubmit = () => {},
  resourceInfo
}: ConfigScrapperSpecEditorProps) {
  const configTypes: SpecType[] = useMemo(
    () =>
      [
        {
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
          schemaFilePrefix: "scrape_config"
        },
        {
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
          schemaFilePrefix: "scrape_config"
        },
        {
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
          schemaFilePrefix: "scrape_config"
        },
        {
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
          schemaFilePrefix: "scrape_config"
        },
        {
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
          schemaFilePrefix: "scrape_config"
        },
        {
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
          schemaFilePrefix: "scrape_config"
        },
        {
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
          schemaFilePrefix: "scrape_config"
        },
        {
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
          schemaFilePrefix: "scrape_config"
        },
        {
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
          schemaFilePrefix: "scrape_config"
        },
        {
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
          schemaFilePrefix: "scrape_config"
        },
        {
          name: "custom",
          label: "Custom",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return resourceValue ?? {};
          },
          icon: FaCog,
          configForm: null,
          specsMapField: "spec",
          rawSpecInput: true,
          schemaFilePrefix: "scrape_config"
        }
      ].sort((a, b) => a.label.localeCompare(b.label)) as SpecType[],
    [onSubmit, resourceValue]
  );

  // there should only be one spec, so we can just grab the first key that isn't schedule
  const selectedSpec = resourceValue?.spec
    ? Object.keys(resourceValue?.spec).filter((key) => key !== "schedule")[0]
    : undefined;

  const configCantEditMessage = `CRD linked to ${
    resourceValue?.namespace ? `${resourceValue.namespace}/` : ""
  }${resourceValue?.name}.`;

  const canEdit = !!!resourceValue?.source;

  return (
    <SpecEditor
      types={configTypes}
      format="yaml"
      resourceInfo={resourceInfo}
      selectedSpec={selectedSpec}
      canEdit={canEdit}
      cantEditMessage={configCantEditMessage}
    />
  );
}
