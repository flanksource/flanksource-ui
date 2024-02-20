import { useMemo } from "react";
import { FaCog } from "react-icons/fa";
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
  resourceInfo: SchemaResourceType;
};

export default function HealthSpecEditor({
  resourceValue,
  onSubmit = () => {},
  resourceInfo
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
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/http"
          },
          {
            type: "code",
            name: "awsConfigRule",
            label: "AWS Config Rule",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "aws",
            specsMapField: "awsConfigRule.0",
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/aws-config-rule"
          },
          {
            type: "code",
            name: "awsConfig",
            label: "AWS Config",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "aws-config",
            specsMapField: "awsConfig.0",
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/aws-config"
          },
          {
            type: "code",
            name: "github",
            label: "GitHub",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "github",
            specsMapField: "github.0",
            schemaFilePrefix: "canary"
          },
          {
            type: "code",
            name: "ec2",
            label: "EC2",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "ec2",
            specsMapField: "ec2.0",
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/ec2"
          },
          {
            type: "code",
            name: "ldap",
            label: "LDAP",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "ldap",
            specsMapField: "ldap.0",
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/ldap"
          },
          {
            type: "code",
            name: "pod",
            label: "Pod",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "pod",
            specsMapField: "pod.0",
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/pod"
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
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/exec"
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
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/alert-manager"
          },
          {
            type: "code",
            name: "cloudwatch",
            label: "Cloud Watch",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "cloudwatch",
            specsMapField: "cloudwatch.0",
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/cloudwatch"
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
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/elasticsearch"
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
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/redis"
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
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/mongo"
          },
          {
            type: "code",
            name: "dns",
            label: "DNS",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "dns",
            specsMapField: "dns.0",
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/dns"
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
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/icmp"
          },
          {
            type: "code",
            name: "gcs",
            label: "GCS",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "gcp",
            specsMapField: "gcs.0",
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/gcs-bucket"
          },
          {
            type: "code",
            name: "s3",
            label: "AWS S3",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "aws-s3-bucket",
            specsMapField: "s3.0",
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/s3-bucket"
          },
          {
            type: "code",
            name: "smb",
            label: "SMB",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "smb",
            specsMapField: "smb.0",
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/smb"
          },
          {
            type: "code",
            name: "sftp",
            label: "SFTP",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "sftp",
            specsMapField: "sftp.0",
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/sftp"
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
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/folder"
          },
          {
            type: "code",
            name: "prometheus",
            label: "Prometheus",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "prometheus",
            specsMapField: "prometheus.0",
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/prometheus"
          },
          {
            type: "code",
            name: "kubernetes",
            label: "Kubernetes",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "kubernetes",
            specsMapField: "kubernetes.0",
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/kubernetes"
          },
          {
            type: "code",
            name: "sql",
            label: "SQL Query",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "postgres",
            specsMapField: "sql.0",
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/postgres"
          },
          {
            type: "code",
            name: "configDB",
            label: "Mission Control Catalog",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "config",
            specsMapField: "configDB.0",
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/configdb"
          },
          {
            type: "code",
            name: "azureDevops",
            label: "Azure DevOps",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "azure-devops",
            specsMapField: "azureDevops.0",
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/azure-devops"
          },
          {
            type: "code",
            name: "jmeter",
            label: "JMeter",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "jmeter",
            specsMapField: "jmeter.0",
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/jmeter"
          },
          {
            type: "code",
            name: "junit",
            label: "JUnit",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "junit",
            specsMapField: "junit.0",
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/junit"
          },
          {
            type: "code",
            name: "dynatrace",
            label: "Dynatrace",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "dynatrace",
            specsMapField: "dynatrace.0",
            schemaFilePrefix: "canary"
          },
          {
            type: "code",
            name: "namespace",
            label: "Kubernetes Namespace",
            updateSpec: (value: Record<string, any>) => {
              onSubmit(value);
            },
            loadSpec: () => {
              return resourceValue ?? {};
            },
            icon: "namespace",
            specsMapField: "namespace.0",
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/kubernetes"
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
            schemaFilePrefix: "canary",
            docsLink: "https://canarychecker.io/reference/tcp"
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
            schemaFilePrefix: "canary"
          }
        ] satisfies SpecType[]
      ).sort((a, b) => a.label.localeCompare(b.label)),
    [onSubmit, resourceValue]
  );

  // there should only be one spec, so we can just grab the first key that isn't schedule
  const selectedSpec = resourceValue?.spec
    ? Object.keys(resourceValue?.spec).filter((key) => key !== "schedule")[0]
    : undefined;

  const canEdit = !!!resourceValue?.source;

  return (
    <SpecEditor
      types={configTypes}
      format="yaml"
      selectedSpec={selectedSpec}
      resourceInfo={resourceInfo}
      canEdit={canEdit}
    />
  );
}
