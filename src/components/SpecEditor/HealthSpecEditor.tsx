import { useMemo } from "react";
import SpecEditor, { SpecType } from "./SpecEditor";
import { HTTPHealthFormEditor } from "../Forms/Health/HTTPHealthFormEditor";
import { FaCog } from "react-icons/fa";

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
  const configTypes = useMemo(
    () =>
      [
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
          configForm: HTTPHealthFormEditor,
          formFieldName: "spec.http.0",
          rawSpecInput: false
        },
        {
          name: "awsConfigRule",
          label: "AWS Config Rule",
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
          label: "AWS Config",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "aws-config",
          configForm: null,
          formFieldName: "spec.awsConfig.0",
          rawSpecInput: true
        },
        {
          name: "github",
          label: "GitHub",
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
          label: "EC2",
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
          label: "LDAP",
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
          label: "Pod",
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
          label: "Exec",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "console",
          configForm: null,
          formFieldName: "spec.exec.0",
          rawSpecInput: true
        },
        {
          name: "alertManager",
          label: "Alert Manager",
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
          label: "Cloud Watch",
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
          label: "Elastic Search",
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
          label: "Redis",
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
          name: "mongo",
          label: "Mongo DB",
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
          label: "DNS",
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
          label: "ICMP Ping",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "icmp",
          configForm: null,
          formFieldName: "spec.ping.0",
          rawSpecInput: true
        },
        {
          name: "gcs",
          label: "GCS",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "gcp",
          configForm: null,
          formFieldName: "spec.gcs.0",
          rawSpecInput: true
        },
        {
          name: "s3",
          label: "AWS S3",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "aws-s3-bucket",
          configForm: null,
          formFieldName: "spec.s3.0",
          rawSpecInput: true
        },
        {
          name: "smb",
          label: "SMB",
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
          label: "SFTP",
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
          label: "Folder",
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
          label: "Prometheus",
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
          label: "Kubernetes",
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
          label: "SQL Query",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "postgres",
          configForm: null,
          formFieldName: "spec.sql.0",
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
          formFieldName: "spec",
          rawSpecInput: true,
          schemaFilePrefix: "canary"
        }
      ].sort((a, b) => a.label.localeCompare(b.label)) as SpecType[],
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
