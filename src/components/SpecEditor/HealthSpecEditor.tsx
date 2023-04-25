import { useMemo } from "react";
import SpecEditor, { SpecType } from "./SpecEditor";
import { HTTPHealthFormEditor } from "../Forms/Health/HTTPHealthFormEditor";

type HealthSpecEditorProps = {
  spec?: Record<string, any>;
  onSubmit?: (spec: Record<string, any>) => void;
  deleteHandler?: (id: string) => void;
};

export default function HealthSpecEditor({
  spec,
  onSubmit = () => {},
  deleteHandler
}: HealthSpecEditorProps) {
  const configTypes: SpecType[] = useMemo(
    () => [
      {
        name: "http",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "http",
        configForm: HTTPHealthFormEditor,
        formFieldName: "spec.http",
        rawSpecInput: false
      },
      {
        name: "AWS Config Rule",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "aws",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "AWS Config",
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
      },
      {
        name: "Github",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "github",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "EC2",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "ec2",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "LDAP",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "LDAP",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "Pod",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "pod",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "Exec",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "exec",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "Alertmanager",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "alertmanager",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "Cloudwatch",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "cloudwatch",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "Elasticsearch",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "elasticsearch",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "Redis",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "redis",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "Mongo",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "mongo",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "DNS",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "dns",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "Ping",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "ping",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "GCS",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "gcs",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "S3",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "s3",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "SMB",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "smb",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "SFTP",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "sftp",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "Folder",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "folder",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "Prometheus",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "prometheus",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "Kubernetes",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "kubernetes",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "SQL",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "sql",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "Custom Health Check Spec",
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
      resourceName="Health Check"
      selectedSpec={selectedSpec}
      deleteHandler={deleteHandler}
    />
  );
}
