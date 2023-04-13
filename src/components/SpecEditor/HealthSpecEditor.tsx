import { useMemo } from "react";
import SpecEditor, { SpecType } from "./SpecEditor";
import { HTTPHealthFormEditor } from "../Forms/Health/HTTPHealthFormEditor";

type HealthSpecEditorProps = {
  spec?: Record<string, any>;
  onSubmit?: (spec: Record<string, any>) => void;
  canEdit?: boolean;
  deleteHandler?: (id: string) => void;
};

export default function HealthSpecEditor({
  spec,
  onSubmit = () => {},
  canEdit = true,
  deleteHandler
}: HealthSpecEditorProps) {
  const configTypes: SpecType[] = useMemo(
    () => [
      {
        name: "http",
        canEdit: canEdit,
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
        canEdit: canEdit,
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
        canEdit: canEdit,
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

        canEdit: canEdit,
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
        canEdit: canEdit,
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
        canEdit: canEdit,
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
        canEdit: canEdit,
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
        canEdit: canEdit,
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
        canEdit: canEdit,
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
        canEdit: canEdit,
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
        canEdit: canEdit,
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
        canEdit: canEdit,
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
        canEdit: canEdit,
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
        canEdit: canEdit,
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
        canEdit: canEdit,
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
        canEdit: canEdit,
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
        canEdit: canEdit,
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
        canEdit: canEdit,
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
        canEdit: canEdit,
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
        canEdit: canEdit,
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
        canEdit: canEdit,
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
        canEdit: canEdit,
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
        canEdit: canEdit,
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
        canEdit: canEdit,
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
    [canEdit, onSubmit, spec]
  );

  // there should only be one spec, so we can just grab the first key
  const selectedSpec = spec ? Object.keys(spec.spec)[0] : undefined;

  return (
    <SpecEditor
      types={configTypes}
      format="yaml"
      resourceName="Health Check"
      canEdit={!!spec}
      selectedSpec={selectedSpec}
      deleteHandler={deleteHandler}
    />
  );
}
