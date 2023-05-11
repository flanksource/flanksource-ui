import { useMemo } from "react";
import SpecEditor, { SpecType } from "./SpecEditor";
import AWSConfigsFormEditor from "../Forms/Configs/AWSConfigsFormEditor";
import KubernetesConfigsFormEditor from "../Forms/Configs/KubernetesConfigsFormEditor";
import { FaCog } from "react-icons/fa";
import { SchemaResourceType } from "../SchemaResourcePage/resourceTypes";

type ConfigScrapperSpecEditorProps = {
  spec?: Record<string, any>;
  onSubmit?: (spec: Record<string, any>) => void;
  resourceInfo: SchemaResourceType;
};

export default function ConfigScrapperSpecEditor({
  spec,
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
            return spec ?? {};
          },
          icon: "kubernetes",
          configForm: KubernetesConfigsFormEditor,
          specsMapField: "kubernetes.0"
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
            return spec ?? {};
          },
          configForm: AWSConfigsFormEditor,
          icon: "aws",
          specsMapField: "aws.0"
        },
        {
          name: "file",
          label: "File",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "folder",
          configForm: null,
          specsMapField: "file.0",
          rawSpecInput: true
        },
        {
          name: "git",
          label: "Git",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "git",
          configForm: null,
          specsMapField: "git.0",
          rawSpecInput: true
        },
        {
          name: "http",
          label: "HTTP",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "http",
          configForm: null,
          specsMapField: "http.0",
          rawSpecInput: true
        },
        {
          name: "azureDevOps",
          label: "Azure DevOps",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "azure",
          configForm: null,
          specsMapField: "azureDevOps.0",
          rawSpecInput: true
        },
        {
          name: "custom",
          label: "Custom",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: FaCog,
          configForm: null,
          specsMapField: "spec",
          rawSpecInput: true,
          schemaFilePrefix: "scrape_config"
        }
      ].sort((a, b) => a.label.localeCompare(b.label)) as SpecType[],
    [onSubmit, spec]
  );

  // there should only be one spec, so we can just grab the first key
  const selectedSpec = spec ? Object.keys(spec)[0] : undefined;

  return (
    <SpecEditor
      types={configTypes}
      format="yaml"
      resourceInfo={resourceInfo}
      selectedSpec={selectedSpec}
    />
  );
}
