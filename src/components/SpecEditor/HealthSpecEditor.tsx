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
        formFieldName: "spec.http.0",
        rawSpecInput: false
      },
      {
        name: "awsConfigRule",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "aws",
        configForm: null,
        formFieldName: "spec.awsConfigRule.0",
        rawSpecInput: true
      },
      {
        name: "awsConfig",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "code",
        configForm: null,
        formFieldName: "spec.awsConfig.0",
        rawSpecInput: true
      },
      {
        name: "github",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "github",
        configForm: null,
        formFieldName: "spec.github.0",
        rawSpecInput: true
      },
      {
        name: "ec2",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "ec2",
        configForm: null,
        formFieldName: "spec.ec2.0",
        rawSpecInput: true
      },
      {
        name: "ldap",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "ldap",
        configForm: null,
        formFieldName: "spec.ldap.0",
        rawSpecInput: true
      },
      {
        name: "pod",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "pod",
        configForm: null,
        formFieldName: "spec.pod.0",
        rawSpecInput: true
      },
      {
        name: "exec",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "exec",
        configForm: null,
        formFieldName: "spec.exec.0",
        rawSpecInput: true
      },
      {
        name: "alertManager",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "alertManager",
        configForm: null,
        formFieldName: "spec.alertManager.0",
        rawSpecInput: true
      },
      {
        name: "cloudwatch",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "cloudwatch",
        configForm: null,
        formFieldName: "spec.cloudwatch.0",
        rawSpecInput: true
      },
      {
        name: "elasticsearch",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "elasticsearch",
        configForm: null,
        formFieldName: "spec.elasticsearch.0",
        rawSpecInput: true
      },
      {
        name: "redis",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "redis",
        configForm: null,
        formFieldName: "spec.redis.0",
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
        formFieldName: "spec.mongo.0",
        rawSpecInput: true
      },
      {
        name: "dns",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "dns",
        configForm: null,
        formFieldName: "spec.dns.0",
        rawSpecInput: true
      },
      {
        name: "ping",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "ping",
        configForm: null,
        formFieldName: "spec.ping.0",
        rawSpecInput: true
      },
      {
        name: "gcs",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "gcs",
        configForm: null,
        formFieldName: "spec.gcs.0",
        rawSpecInput: true
      },
      {
        name: "s3",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "s3",
        configForm: null,
        formFieldName: "spec.s3.0",
        rawSpecInput: true
      },
      {
        name: "smb",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "smb",
        configForm: null,
        formFieldName: "spec.smb.0",
        rawSpecInput: true
      },
      {
        name: "sftp",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "sftp",
        configForm: null,
        formFieldName: "spec.sftp.0",
        rawSpecInput: true
      },
      {
        name: "folder",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "folder",
        configForm: null,
        formFieldName: "spec.folder.0",
        rawSpecInput: true
      },
      {
        name: "prometheus",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "prometheus",
        configForm: null,
        formFieldName: "spec.prometheus.0",
        rawSpecInput: true
      },
      {
        name: "kubernetes",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "kubernetes",
        configForm: null,
        formFieldName: "spec.kubernetes.0",
        rawSpecInput: true
      },
      {
        name: "sql",
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "sql",
        configForm: null,
        formFieldName: "spec.sql.0",
        rawSpecInput: true
      },
      {
        name: "custom",
        label: "Custom Health Check Spec",
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

  console.log("selectedSpec", selectedSpec);

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
