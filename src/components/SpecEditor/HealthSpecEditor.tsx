import { useMemo } from "react";
import { AlertmanagerHealthFormEditor } from "../Forms/Health/AlertmanagerHealthFormEditor";
import { ElasticsearchHealthFormEditor } from "../Forms/Health/ElasticsearchHealthFormEditor";
import { ExecHealthFormEditor } from "../Forms/Health/ExecHealthFormEditor";
import { FolderHealthFormEditor } from "../Forms/Health/FolderHealthFormEditor";
import { HTTPHealthFormEditor } from "../Forms/Health/HTTPHealthFormEditor";
import { ICMPHealthFormEditor } from "../Forms/Health/ICMPHealthFormEditor";
import { MongoHealthFormEditor } from "../Forms/Health/MongoHealthFormEditor";
import { RedisHealthFormEditor } from "../Forms/Health/RedisHealthFormEditor";
import { TCPHealthFormEditor } from "../Forms/Health/TCPHealthFormEditor";
import { SchemaResourceType } from "../SchemaResourcePage/resourceTypes";
import SpecEditor, { SpecType } from "./SpecEditor";

type HealthSpecEditorProps = {
  resourceValue?: {
    id?: string;
    name?: string;
    namespace?: string;
    spec?: Record<string, any>;
    [key: string]: any;
  };
  onSubmit?: (spec: Record<string, any>) => void;
  onDeleted?: () => void;
  resourceInfo: SchemaResourceType;
};

export default function HealthSpecEditor({
  resourceValue,
  onSubmit = () => {},
  resourceInfo,
  onDeleted
}: HealthSpecEditorProps) {
  const configTypes: SpecType[] = useMemo(
    () =>
      (
        [
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
            configForm: HTTPHealthFormEditor,
            specsMapField: "http.0",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/http"
          },
          {
            type: "custom",
            name: "awsConfigRule",
            label: "AWS Config Rule",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "aws",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/aws-config-rule"
          },
          {
            type: "custom",
            name: "awsConfig",
            label: "AWS Config",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "aws-config",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/aws-config"
          },
          {
            type: "custom",
            name: "github",
            label: "GitHub",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "github",
            schemaFileName: "canary.spec.schema.json"
          },
          {
            type: "custom",
            name: "ldap",
            label: "LDAP",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "ldap",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/ldap"
          },

          {
            type: "form",
            name: "exec",
            label: "Exec",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "console",
            configForm: ExecHealthFormEditor,
            specsMapField: "exec.0",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/exec"
          },
          {
            type: "form",
            name: "alertManager",
            label: "Alert Manager",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "alertManager",
            configForm: AlertmanagerHealthFormEditor,
            specsMapField: "alertManager.0",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/alert-manager"
          },
          {
            type: "custom",
            name: "cloudwatch",
            label: "Cloud Watch",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "cloudwatch",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/cloudwatch"
          },
          {
            type: "form",
            name: "elasticsearch",
            label: "Elasticsearch",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "elasticsearch",
            configForm: ElasticsearchHealthFormEditor,
            specsMapField: "elasticsearch.0",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/elasticsearch"
          },
          {
            type: "form",
            name: "redis",
            label: "Redis",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "redis",
            configForm: RedisHealthFormEditor,
            specsMapField: "redis.0",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/redis"
          },
          {
            type: "form",
            name: "mongo",
            label: "Mongo DB",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "mongo",
            configForm: MongoHealthFormEditor,
            specsMapField: "mongo.0",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/mongo"
          },
          {
            type: "custom",
            name: "dns",
            label: "DNS",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "dns",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/dns"
          },
          {
            type: "form",
            name: "ping",
            label: "ICMP Ping",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "icmp",
            configForm: ICMPHealthFormEditor,
            specsMapField: "icmp.0",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/icmp"
          },
          {
            type: "custom",
            name: "gcs",
            label: "GCS",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "gcp",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/gcs-bucket"
          },
          {
            type: "custom",
            name: "s3",
            label: "AWS S3",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "aws-s3-bucket",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/s3-bucket"
          },
          {
            type: "custom",
            name: "smb",
            label: "SMB",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "smb",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/smb"
          },
          {
            type: "custom",
            name: "sftp",
            label: "SFTP",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "sftp",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/sftp"
          },
          {
            type: "form",
            name: "folder",
            label: "Folder",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "folder",
            configForm: FolderHealthFormEditor,
            specsMapField: "folder.0",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/folder"
          },
          {
            type: "custom",
            name: "prometheus",
            label: "Prometheus",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "prometheus",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/prometheus"
          },
          {
            type: "custom",
            name: "kubernetes",
            label: "Kubernetes",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "kubernetes",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/kubernetes"
          },

          {
            type: "custom",
            name: "kubernetesResource",
            label: "Kubernetes Resource",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "kubernetes",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/kubernetesResource"
          },
          {
            type: "custom",
            name: "sql",
            label: "SQL Query",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "postgres",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/postgres"
          },
          {
            type: "custom",
            name: "catalog",
            label: "Mission Control Catalog",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "config",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/catalog"
          },
          {
            type: "custom",
            name: "azureDevops",
            label: "Azure DevOps",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "azure-devops",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/azure-devops"
          },
          {
            type: "custom",
            name: "jmeter",
            label: "JMeter",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "jmeter",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/jmeter"
          },
          {
            type: "custom",
            name: "junit",
            label: "JUnit",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "junit",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/junit"
          },
          {
            type: "custom",
            name: "dynatrace",
            label: "Dynatrace",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "dynatrace",
            schemaFileName: "canary.spec.schema.json"
          },
          {
            type: "form",
            name: "tcp",
            label: "TCP",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "network",
            configForm: TCPHealthFormEditor,
            specsMapField: "tcp.0",
            schemaFileName: "canary.spec.schema.json",
            docsLink: "canary-checker/reference/tcp"
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
            icon: "cog",
            schemaFileName: "canary.spec.schema.json"
          }
        ] satisfies SpecType[]
      ).sort((a, b) => a.label.localeCompare(b.label)),
    [onSubmit, resourceValue]
  );

  // there should only be one spec, so we can just grab the first key that isn't
  // schedule, otherwise we'll just use custom
  const selectedSpec =
    (resourceValue?.spec
      ? Object.keys(resourceValue?.spec).filter((key) => key !== "schedule")[0]
      : undefined) ?? undefined;

  return (
    <SpecEditor
      onDeleted={onDeleted}
      types={configTypes}
      format="yaml"
      selectedSpec={resourceValue?.id ? selectedSpec ?? "custom" : undefined}
      resourceInfo={resourceInfo}
    />
  );
}
