import { useMemo } from "react";
import SpecEditor, { SpecType } from "./SpecEditor";
import AWSConfigsFormEditor from "../Forms/Configs/AWSConfigsFormEditor";
import KubernetesConfigsFormEditor from "../Forms/Configs/KubernetesConfigsFormEditor";

type ConfigScrapperSpecEditorProps = {
  spec?: Record<string, any>;
  onSubmit?: (spec: Record<string, any>) => void;
  deleteHandler?: (id: string) => void;
};

export default function ConfigScrapperSpecEditor({
  spec,
  onSubmit = () => {},
  deleteHandler
}: ConfigScrapperSpecEditorProps) {
  const configTypes: SpecType[] = useMemo(
    () => [
      {
        name: "kubernetes",
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
        formFieldName: "spec.kubernetes.0"
      },
      {
        name: "aws",
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
        formFieldName: "spec.aws.0"
      },
      {
        name: "file",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "file",
        configForm: null,
        formFieldName: "spec.file.0",
        rawSpecInput: true
      },
      {
        name: "git",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "git",
        configForm: null,
        formFieldName: "spec.git.0",
        rawSpecInput: true
      },
      {
        name: "http",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "http",
        configForm: null,
        formFieldName: "spec.http.0",
        rawSpecInput: true
      },
      {
        name: "azureDevOps",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "azure",
        configForm: null,
        formFieldName: "spec.azureDevOps.0",
        rawSpecInput: true
      },
      {
        name: "custom",
        label: "Custom Config Spec",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "code",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      }
    ],
    [onSubmit, spec]
  );

  // there should only be one spec, so we can just grab the first key
  const selectedSpec = spec ? Object.keys(spec.spec)[0] : undefined;

  return (
    <SpecEditor
      types={configTypes}
      format="yaml"
      resourceName="Config Scraper"
      selectedSpec={selectedSpec}
      deleteHandler={deleteHandler}
    />
  );
}
