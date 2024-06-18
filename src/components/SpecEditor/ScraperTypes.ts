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
import { SpecType } from "./SpecEditor";

export default function scraperTypes(
  onSubmit: (values: Record<string, any>) => void,
  resourceValue?: Record<string, any>
) {
  let types: SpecType[] = [
    {
      type: "form",
      name: "aws",
      label: "AWS",
      updateSpec: (value: Record<string, any>) => {
        onSubmit(value);
      },
      loadSpec: () => {
        // probably need to query the spec from the backend
        return resourceValue ?? {};
      },
      icon: "aws",
      configForm: AWSConfigsFormEditor,
      specsMapField: "aws.0",
      schemaFileName: "config_aws.schema.json",
      help: "config-db/scrapers/aws"
    },
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
      help: "config-db/scrapers/kubernetes"
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
      help: "config-db/scrapers/azure"
    },
    {
      type: "form",
      name: "kubernetesFile",
      label: "File (Kubernetes Pod)",
      updateSpec: (value: Record<string, any>) => {
        onSubmit(value);
      },
      loadSpec: () => {
        return resourceValue ?? {};
      },
      icon: "k8s-pod",
      configForm: KubernetesFileConfigsFormEditor,
      specsMapField: "kubernetesFile.0",
      schemaFileName: "config_kubernetesfile.schema.json",
      help: "config-db/scrapers/kubernetes-file"
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
      help: "config-db/scrapers/sql"
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
      help: "config-db/scrapers/trivy"
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
      help: "config-db/scrapers/file"
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
      help: "config-db/scrapers/azure-devops"
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
      icon: "github",
      configForm: GithubActionsConfigsFormEditor,
      specsMapField: "githubActions.0",
      schemaFileName: "config_githubactions.schema.json"
    },
    {
      name: "custom",
      type: "code",
      label: "Custom",
      updateSpec: (value: Record<string, any>) => {
        onSubmit(value);
      },
      loadSpec: () => {
        return resourceValue ?? {};
      },
      icon: FaCog,
      specsMapField: "spec",
      schemaFileName: "scrape_config.schema.json"
    }
  ];
  types.sort((a, b) => a?.label?.localeCompare(b?.label || "") || 0);
  return types;
}
