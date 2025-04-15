import { DiGoogleCloudPlatform } from "react-icons/di";
import { FaWindows } from "react-icons/fa";
import { stringSortHelper } from "../../utils/common";
import { Connection } from "./ConnectionFormModal";

const enum ConnectionsFieldTypes {
  checkbox = "checkbox",
  input = "input",
  numberInput = "numberInput",
  EnvVarSource = "EnvVarSource",
  SwitchField = "SwitchField",
  ConnectionSwitch = "ConnectionSwitch",
  Authentication = "authentication",
  GroupField = "GroupField"
}

type Variant = "small" | "large";

const variants: { [key: string]: Variant } = {
  small: "small",
  large: "large"
};

export type ConnectionFormFields = {
  label: string;
  key: string;
  type: ConnectionsFieldTypes;
  variant?: Variant;
  required?: boolean;
  hint?: string;
  default?: boolean | number | string;
  hideLabel?: boolean;
  switchFieldProps?: {
    options: {
      label: string;
      key: string;
    }[];
  };
  groupFieldProps?: {
    fields: Omit<ConnectionFormFields, "groupFieldProps">[];
  };
  options?: {
    label: string;
    key: string;
    fields: Omit<ConnectionFormFields, "options">[];
  }[];
  condition?: (data: Record<string, any>) => boolean;
};

export const enum ConnectionValueType {
  Anthropic = "anthropic",
  Ollama = "ollama",
  OpenAI = "openai",
  AWS = "aws",
  AWS_S3 = "s3",
  Azure = "azure",
  AzureDevops = "azure_devops",
  Discord = "discord",
  Dynatrace = "dynatrace",
  ElasticSearch = "elasticsearch",
  Email = "email",
  GCP = "google_cloud",
  GenericWebhook = "generic_webhook",
  Git = "git",
  Github = "github",
  GoogleChat = "google_chat",
  HTTP = "http",
  IFTTT = "ifttt",
  JMeter = "jmeter",
  Kubernetes = "kubernetes",
  LDAP = "ldap",
  Matrix = "matrix",
  Mattermost = "mattermost",
  Mongo = "mongo",
  MySQL = "mysql",
  Ntfy = "ntfy",
  OpsGenie = "opsgenie",
  Postgres = "postgres",
  Prometheus = "prometheus",
  Pushbullet = "pushbullet",
  Pushover = "pushover",
  Redis = "redis",
  Restic = "restic",
  Rocketchat = "rocketchat",
  SFTP = "sftp",
  Slack = "slack",
  SlackWebhook = "slackwebhook",
  SMB = "smb",
  SQLServer = "sql_server",
  Teams = "teams",
  Telegram = "telegram",
  Webhook = "webhook",
  Windows = "windows",
  ZulipChat = "zulip_chat",
  Folder = "folder",
  GCS = "gcs",
  Gitlab = "gitlab"
}

export type ConnectionType = {
  title: string;
  value: ConnectionValueType;
  icon?: JSX.Element | string | null;
  fields: ConnectionFormFields[];
  convertToFormSpecificValue?: (data: Record<string, string>) => Connection;
  preSubmitConverter?: (data: Record<string, string>) => object;
  hide?: boolean;

  /** indicates whether this connection is primarily for notification */
  forNotification?: boolean;
};

export const commonConnectionFormFields: ConnectionFormFields[] = [
  {
    label: "Name",
    key: "name",
    type: ConnectionsFieldTypes.input,
    required: true
  },
  {
    label: "Namespace",
    key: "namespace",
    type: ConnectionsFieldTypes.input,
    default: "default",
    required: true
  }
];

export const connectionTypes: ConnectionType[] = [
  {
    title: "Anthropic",
    icon: "anthropic",
    value: ConnectionValueType.Anthropic,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Model",
        key: "model",
        type: ConnectionsFieldTypes.input,
        required: false
      },
      {
        label: "Base URL",
        hint: "appropriate when using a proxy",
        key: "url",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: false
      },
      {
        label: "API Key",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        model: data?.properties?.model
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        url: data.url,
        password: data.password,
        properties: {
          model: data.model
        }
      };
    }
  },
  {
    title: "OpenAI",
    icon: "openai",
    value: ConnectionValueType.OpenAI,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "URL",
        key: "url",
        hint: "appropriate when using a proxy",
        type: ConnectionsFieldTypes.input,
        required: false
      },
      {
        label: "Model",
        key: "model",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: false
      },
      {
        label: "API Key",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        model: data?.properties?.model
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        url: data.url,
        password: data.password,
        properties: {
          model: data.model
        }
      };
    }
  },
  {
    title: "Ollama",
    icon: "ollama",
    value: ConnectionValueType.Ollama,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "URL",
        key: "url",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Model",
        key: "model",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: false
      },
      {
        label: "API Key",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        model: data?.properties?.model
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        url: data.url,
        password: data.password,
        properties: {
          model: data.model
        }
      };
    }
  },
  {
    title: "Postgres",
    icon: "postgres",
    value: ConnectionValueType.Postgres,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "URL",
        key: "url",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Username",
        key: "username",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Password",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      }
    ]
  },
  {
    title: "MySQL",
    icon: "mysql",
    value: ConnectionValueType.MySQL,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "URL",
        key: "url",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Username",
        key: "username",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Password",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      }
    ]
  },
  {
    title: "SQL Server",
    icon: "sqlserver",
    value: ConnectionValueType.SQLServer,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "URL",
        key: "url",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Username",
        key: "username",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Password",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      }
    ]
  },
  {
    title: "HTTP",
    icon: "http",
    value: ConnectionValueType.HTTP,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "URL",
        key: "url",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Username",
        key: "username",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Password",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Insecure TLS",
        key: "insecure_tls",
        type: ConnectionsFieldTypes.checkbox
      }
    ]
  },
  {
    title: "Prometheus",
    icon: "prometheus",
    value: ConnectionValueType.Prometheus,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "URL",
        key: "url",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Username",
        key: "username",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: false
      },
      {
        label: "Password",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: false
      },
      {
        label: "Insecure TLS",
        key: "insecure_tls",
        type: ConnectionsFieldTypes.checkbox
      }
    ]
  },
  {
    title: "Elasticsearch",
    icon: "elasticsearch",
    value: ConnectionValueType.ElasticSearch,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "URL",
        key: "url",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Username",
        key: "username",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Password",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Insecure TLS",
        key: "insecure_tls",
        type: ConnectionsFieldTypes.checkbox
      }
    ]
  },
  {
    title: "Mongo",
    icon: "mongo",
    value: ConnectionValueType.Mongo,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "URL",
        key: "url",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Username",
        key: "username",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Password",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Insecure TLS",
        key: "insecure_tls",
        type: ConnectionsFieldTypes.checkbox
      }
    ]
  },
  {
    title: "LDAP",
    icon: "ldap",
    value: ConnectionValueType.LDAP,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "URL",
        key: "url",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Username",
        key: "username",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Password",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Insecure TLS",
        key: "insecure_tls",
        type: ConnectionsFieldTypes.checkbox
      }
    ]
  },
  {
    title: "Redis",
    icon: "redis",
    value: ConnectionValueType.Redis,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Database",
        key: "db",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "URL",
        key: "url",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Username",
        key: "username",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: false
      },
      {
        label: "Password",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: false
      },
      {
        label: "Insecure TLS",
        key: "insecure_tls",
        type: ConnectionsFieldTypes.checkbox
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        db: data?.properties?.db
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        url: data.url,
        username: data.username,
        password: data.password,
        insecure_tls: data.insecure_tls,
        properties: {
          db: data.db
        }
      };
    }
  },
  {
    title: "Windows",
    value: ConnectionValueType.Windows,
    icon: <FaWindows className="h-5 w-5" />,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Username",
        key: "username",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Password",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Domain",
        key: "domain",
        type: ConnectionsFieldTypes.input,
        required: false
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        domain: data?.properties?.domain
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        username: data.username,
        password: data.password,
        url: data.url,
        properties: {
          domain: data.domain
        }
      };
    }
  },
  {
    title: "Google Cloud",
    value: ConnectionValueType.GCP,
    icon: <DiGoogleCloudPlatform className="h-6 w-6" />,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Endpoint",
        key: "url",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Certificate",
        key: "certificate",
        type: ConnectionsFieldTypes.EnvVarSource,
        variant: variants.large,
        required: true
      }
    ]
  },
  {
    title: "Google Cloud Storage",
    icon: "gcs",
    value: ConnectionValueType.GCS,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Endpoint",
        key: "url",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Certificate",
        key: "certificate",
        type: ConnectionsFieldTypes.EnvVarSource,
        variant: variants.large,
        required: true
      }
    ]
  },
  {
    title: "SFTP",
    icon: "sftp",
    value: ConnectionValueType.SFTP,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Host",
        key: "host",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Username",
        key: "username",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Password",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Port",
        key: "port",
        type: ConnectionsFieldTypes.input,
        required: false,
        default: 22
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        port: data?.properties?.port ?? 4
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        namespace: data.namespace,
        url: data.host,
        username: data.username,
        password: data.password,
        properties: {
          port: data.port
        }
      };
    }
  },
  {
    title: "AWS",
    icon: "aws",
    value: ConnectionValueType.AWS,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Region",
        key: "region",
        type: ConnectionsFieldTypes.input,
        required: false
      },
      {
        label: "Profile",
        key: "profile",
        type: ConnectionsFieldTypes.input,
        required: false
      },
      {
        label: "Access Key",
        key: "username",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: false
      },
      {
        label: "Secret Key",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: false
      },
      {
        label: "Insecure TLS",
        key: "insecure_tls",
        type: ConnectionsFieldTypes.checkbox
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        region: data?.properties?.region,
        profile: data?.properties?.profile,
        insecure_tls: data?.properties?.insecureTLS === "true"
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        username: data.username,
        password: data.password,
        properties: {
          region: data.region,
          profile: data.profile,
          insecureTLS: data.insecure_tls
        }
      };
    }
  },
  {
    title: "AWS S3",
    icon: "aws-s3",
    value: ConnectionValueType.AWS_S3,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Region",
        key: "region",
        type: ConnectionsFieldTypes.input,
        required: false
      },
      {
        label: "Profile",
        key: "profile",
        type: ConnectionsFieldTypes.input,
        required: false
      },
      {
        label: "Access Key",
        key: "username",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: false
      },
      {
        label: "Secret Key",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: false
      },
      {
        label: "Insecure TLS",
        key: "insecure_tls",
        type: ConnectionsFieldTypes.checkbox
      },
      {
        label: "Bucket",
        key: "bucket",
        type: ConnectionsFieldTypes.input,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        region: data?.properties?.region,
        profile: data?.properties?.profile,
        insecure_tls: data?.insecure_tls === true,
        bucket: data?.properties?.bucket
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        username: data.username,
        password: data.password,
        insecure_tls: !!data.insecure_tls,
        properties: {
          region: data.region,
          profile: data.profile,
          bucket: data.bucket
        }
      };
    }
  },
  {
    title: "Kubernetes",
    icon: "kubernetes",
    value: ConnectionValueType.Kubernetes,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Connection Method",
        key: "connectionMethod",
        type: ConnectionsFieldTypes.SwitchField,
        default: "kubeconfig",
        switchFieldProps: {
          options: [
            {
              label: "Kubeconfig",
              key: "kubeconfig"
            },
            {
              label: "EKS",
              key: "eks"
            },
            {
              label: "GKE",
              key: "gke"
            },
            {
              label: "CNRM",
              key: "cnrm"
            }
          ]
        },
        required: true
      },
      // Kubeconfig option
      {
        label: "Kubeconfig",
        key: "kubeconfig",
        type: ConnectionsFieldTypes.EnvVarSource,
        variant: variants.large,
        required: false,
        hint: "Source for kubeconfig",
        condition: (data: Record<string, any>) => data.connectionMethod === "kubeconfig"
      },
      // EKS Connection options
      {
        label: "Cluster Name",
        key: "eksCluster",
        type: ConnectionsFieldTypes.input,
        required: false,
        hint: "Name of the EKS cluster",
        condition: (data: Record<string, any>) => data.connectionMethod === "eks"
      },
      {
        label: "Connection URL",
        key: "eksConnection",
        type: ConnectionsFieldTypes.input,
        required: false,
        hint: "The connection URL to use for EKS, mutually exclusive with access key and secret key",
        condition: (data: Record<string, any>) => data.connectionMethod === "eks"
      },
      {
        label: "Access Key",
        key: "eksAccessKey",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: false,
        condition: (data: Record<string, any>) => data.connectionMethod === "eks"
      },
      {
        label: "Secret Key",
        key: "eksSecretKey",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: false,
        condition: (data: Record<string, any>) => data.connectionMethod === "eks"
      },
      {
        label: "Region",
        key: "eksRegion",
        type: ConnectionsFieldTypes.input,
        required: false,
        hint: "The AWS region",
        condition: (data: Record<string, any>) => data.connectionMethod === "eks"
      },
      {
        label: "Endpoint",
        key: "eksEndpoint",
        type: ConnectionsFieldTypes.input,
        required: false,
        hint: "Custom AWS Endpoint to use",
        condition: (data: Record<string, any>) => data.connectionMethod === "eks"
      },
      {
        label: "Skip TLS Verify",
        key: "eksSkipTLSVerify",
        type: ConnectionsFieldTypes.checkbox,
        hint: "Skip TLS verify when connecting to AWS",
        condition: (data: Record<string, any>) => data.connectionMethod === "eks"
      },
      // GKE Connection options
      {
        label: "Cluster Name",
        key: "gkeCluster",
        type: ConnectionsFieldTypes.input,
        required: false,
        hint: "Name of the GKE cluster",
        condition: (data: Record<string, any>) => data.connectionMethod === "gke"
      },
      {
        label: "Project",
        key: "gkeProject",
        type: ConnectionsFieldTypes.input,
        required: false,
        hint: "Name of the GCP project",
        condition: (data: Record<string, any>) => data.connectionMethod === "gke"
      },
      {
        label: "Zone",
        key: "gkeZone",
        type: ConnectionsFieldTypes.input,
        required: false,
        hint: "Name of the GCP zone",
        condition: (data: Record<string, any>) => data.connectionMethod === "gke"
      },
      {
        label: "Connection URL",
        key: "gkeConnection",
        type: ConnectionsFieldTypes.input,
        required: false,
        hint: "The connection URL to use for GKE, mutually exclusive with credentials",
        condition: (data: Record<string, any>) => data.connectionMethod === "gke"
      },
      {
        label: "Credentials",
        key: "gkeCredentials",
        type: ConnectionsFieldTypes.EnvVarSource,
        variant: variants.large,
        required: false,
        hint: "The credentials to use for authentication",
        condition: (data: Record<string, any>) => data.connectionMethod === "gke"
      },
      {
        label: "Endpoint",
        key: "gkeEndpoint",
        type: ConnectionsFieldTypes.input,
        required: false,
        hint: "Custom GCP Endpoint to use",
        condition: (data: Record<string, any>) => data.connectionMethod === "gke"
      },
      {
        label: "Skip TLS Verify",
        key: "gkeSkipTLSVerify",
        type: ConnectionsFieldTypes.checkbox,
        hint: "Skip TLS verification when connecting to GCP",
        condition: (data: Record<string, any>) => data.connectionMethod === "gke"
      },
      // CNRM Connection options
      {
        label: "Cluster Resource",
        key: "cnrmClusterResource",
        type: ConnectionsFieldTypes.input,
        required: false,
        hint: "Name of the cluster resource",
        condition: (data: Record<string, any>) => data.connectionMethod === "cnrm"
      },
      {
        label: "Cluster Resource Namespace",
        key: "cnrmClusterResourceNamespace",
        type: ConnectionsFieldTypes.input,
        required: false,
        hint: "Namespace of the cluster resource",
        condition: (data: Record<string, any>) => data.connectionMethod === "cnrm"
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      // Create a base Connection object with standard fields
      const connection: Connection = {
        ...data,
        name: data.name,
        namespace: data.namespace,
        type: ConnectionValueType.Kubernetes
      };
      
      // Properties are already in data.properties, so no need to restructure them
      // Just pass the data through as is
      
      return connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      const connectionMethod = data.connectionMethod || "kubeconfig";
      
      const properties: Record<string, any> = {
        connectionMethod
      };
      
      if (connectionMethod === "kubeconfig" && data.kubeconfig) {
        properties.kubeconfig = data.kubeconfig;
      }
      
      if (connectionMethod === "eks") {
        properties.eksCluster = data.eksCluster;
        properties.eksConnection = data.eksConnection;
        properties.eksAccessKey = data.eksAccessKey;
        properties.eksSecretKey = data.eksSecretKey;
        properties.eksRegion = data.eksRegion;
        properties.eksEndpoint = data.eksEndpoint;
        properties.eksSkipTLSVerify = data.eksSkipTLSVerify;
      }
      
      if (connectionMethod === "gke") {
        properties.gkeCluster = data.gkeCluster;
        properties.gkeProject = data.gkeProject;
        properties.gkeZone = data.gkeZone;
        properties.gkeConnection = data.gkeConnection;
        properties.gkeCredentials = data.gkeCredentials;
        properties.gkeEndpoint = data.gkeEndpoint;
        properties.gkeSkipTLSVerify = data.gkeSkipTLSVerify;
      }
      
      if (connectionMethod === "cnrm") {
        properties.cnrmClusterResource = data.cnrmClusterResource;
        properties.cnrmClusterResourceNamespace = data.cnrmClusterResourceNamespace;
        
        // If CNRM is using GKE, include those fields
        if (data.gkeCluster) {
          properties.gkeCluster = data.gkeCluster;
          properties.gkeProject = data.gkeProject;
          properties.gkeZone = data.gkeZone;
          properties.gkeConnection = data.gkeConnection;
          properties.gkeCredentials = data.gkeCredentials;
          properties.gkeEndpoint = data.gkeEndpoint;
          properties.gkeSkipTLSVerify = data.gkeSkipTLSVerify;
        }
      }
      
      return {
        name: data.name,
        namespace: data.namespace,
        properties
      };
    }
  },
  {
    title: "Azure Devops",
    icon: "azure-devops",
    value: ConnectionValueType.AzureDevops,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Organization",
        key: "username",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Personal Access Token",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      }
    ]
  },
  {
    title: "Azure",
    icon: "azure",
    value: ConnectionValueType.Azure,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Client ID",
        key: "username",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Client Secret",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Tenant ID",
        key: "tenant",
        type: ConnectionsFieldTypes.input,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        tenant: data?.properties?.tenant
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        username: data.username,
        password: data.password,
        properties: {
          tenant: data.tenant
        }
      };
    }
  },
  {
    title: "GitHub",
    icon: "github",
    value: ConnectionValueType.Github,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Personal Access Token",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      }
    ]
  },
  {
    title: "Gitlab",
    icon: "gitlab",
    value: ConnectionValueType.Gitlab,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Personal Access Token",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      }
    ]
  },
  {
    title: "Restic",
    icon: "restic",
    value: ConnectionValueType.Restic,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Password",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Repository URL",
        key: "url",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "AWS Connection Name",
        key: "awsConnectionName",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Access Key",
        key: "accessKey",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Secret Key",
        key: "secretKey",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        password: data.password,
        url: data.url,
        awsConnectionName: data.awsConnectionName,
        accessKey: data.accessKey,
        secretKey: data.secretKey
      };
    }
  },
  {
    title: "SMB",
    icon: "smb",
    value: ConnectionValueType.SMB,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Server",
        key: "server",
        type: ConnectionsFieldTypes.GroupField,
        groupFieldProps: {
          fields: [
            {
              label: "Server",
              key: "server",
              type: ConnectionsFieldTypes.input,
              required: true
            },
            {
              label: "Port",
              key: "port",
              type: ConnectionsFieldTypes.numberInput,
              default: 445
            }
          ]
        }
      },
      {
        label: "Share",
        key: "share",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Username",
        key: "username",
        type: ConnectionsFieldTypes.input
      },
      {
        label: "Password",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        workstation: data?.properties?.workstation,
        sharename: data?.properties?.sharename,
        searchPath: data?.properties?.searchPath,
        port: data?.properties?.port
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        username: data.username,
        password: data.password,
        properties: {
          workstation: data.workstation,
          sharename: data.sharename,
          searchPath: data.searchPath,
          port: data.port
        }
      };
    }
  },
  {
    title: "JMeter",
    icon: "jmeter",
    value: ConnectionValueType.JMeter,
    hide: true,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Host",
        key: "url",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Port",
        key: "port",
        type: ConnectionsFieldTypes.numberInput
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        port: data?.properties?.port
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        url: data.url,
        properties: {
          port: data.port
        }
      };
    }
  },
  {
    title: "Dynatrace",
    icon: "dynatrace",
    value: ConnectionValueType.Dynatrace,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Host",
        key: "url",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "API Key",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Scheme",
        key: "scheme",
        type: ConnectionsFieldTypes.input,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        scheme: data?.properties?.scheme
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        url: data.url,
        password: data.password,
        properties: {
          scheme: data.scheme
        }
      };
    }
  },
  {
    title: "Discord",
    forNotification: true,
    icon: "discord",
    value: ConnectionValueType.Discord,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Webhook ID",
        key: "username",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Token",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      }
    ],
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        username: data.username,
        password: data.password,
        url: `discord://$(password)@${data.username}`
      };
    }
  },
  {
    title: "Email",
    forNotification: true,
    icon: "email",
    value: ConnectionValueType.Email,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Host",
        key: "host",
        type: ConnectionsFieldTypes.GroupField,
        groupFieldProps: {
          fields: [
            {
              label: "Host",
              key: "host",
              type: ConnectionsFieldTypes.input,
              required: true
            },
            {
              label: "Port",
              key: "port",
              type: ConnectionsFieldTypes.numberInput,
              required: true,
              default: 587
            }
          ]
        }
      },
      {
        label: "Username",
        key: "username",
        type: ConnectionsFieldTypes.EnvVarSource
      },
      {
        label: "Password",
        key: "password",
        hint: "SMTP server password or hash (for OAuth2)",
        type: ConnectionsFieldTypes.EnvVarSource
      },
      {
        label: "From Address",
        key: "from",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "From Name",
        key: "fromName",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Encryption method",
        key: "encryptionMethod",
        type: ConnectionsFieldTypes.SwitchField,
        switchFieldProps: {
          options: [
            {
              label: "None",
              key: "None"
            },
            {
              label: "ExplicitTLS",
              key: "ExplicitTLS"
            },
            {
              label: "ImplicitTLS",
              key: "ImplicitTLS"
            },
            {
              label: "Auto (default)",
              key: "Auto"
            }
          ]
        },
        default: "Auto",
        required: true
      },
      {
        label: "SMTP authentication method",
        key: "authMethod",
        type: ConnectionsFieldTypes.SwitchField,
        switchFieldProps: {
          options: [
            {
              label: "None",
              key: "None"
            },
            {
              label: "Plain",
              key: "Plain"
            },
            {
              label: "CRAMMD5",
              key: "CRAMMD5"
            },
            {
              label: "Unknown",
              key: "Unknown"
            },
            {
              label: "OAuth2",
              key: "OAuth2"
            }
          ]
        },
        default: "Unknown",
        required: true
      },
      {
        label: "Insecure TLS",
        key: "insecure_tls",
        type: ConnectionsFieldTypes.checkbox
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        authMethod: data?.properties?.authMethod,
        encryptionMethod: data?.properties?.encryptionMethod,
        from: data?.properties?.from,
        fromName: data?.properties?.fromName,
        host: data?.properties?.host,
        port: data?.properties?.port
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        url: `smtp://$(username):$(password)@${data.host}:${data.port}/?UseStartTLS=${data.insecure_tls}&Encryption=${data.encryptionMethod}&Auth=${data.authMethod}`,
        username: data.username,
        password: data.password,
        insecure_tls: data.insecure_tls,
        properties: {
          authMethod: data.authMethod,
          encryptionMethod: data.encryptionMethod,
          from: data.from,
          fromName: data.fromName,
          host: data.host,
          port: data.port
        }
      };
    }
  },
  {
    title: "Google Chat",
    forNotification: true,
    icon: "google-chat",
    value: ConnectionValueType.GoogleChat,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Key",
        key: "username",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Token",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Webhook Name",
        key: "webhook",
        type: ConnectionsFieldTypes.input,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        webhook: data?.properties?.webhook
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        url: `googlechat://chat.googleapis.com/v1/spaces/${data.webhook}/messages?key=$(username)&token=$(password)`,
        username: data.username,
        password: data.password,
        properties: {
          webhook: data.webhook
        }
      };
    }
  },
  {
    title: "IFTTT",
    forNotification: true,
    icon: "ifttt",
    value: ConnectionValueType.IFTTT,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Webhook ID",
        key: "username",
        type: ConnectionsFieldTypes.input,
        required: true
      }
    ],
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        url: `ifttt://${data.username}`,
        username: data.username
      };
    }
  },
  {
    title: "Mattermost",
    forNotification: true,
    icon: "mattermost",
    value: ConnectionValueType.Mattermost,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Username",
        key: "username",
        hint: "Override webhook user",
        type: ConnectionsFieldTypes.input,
        required: false
      },
      {
        label: "Host",
        key: "host",
        hint: "Mattermost server host (host:port)",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Token",
        key: "password",
        hint: "Webhook token",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Channel",
        key: "channel",
        hint: "Override webhook channel",
        type: ConnectionsFieldTypes.input,
        required: false
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        host: data?.properties?.host,
        channel: data?.properties?.channel
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        username: data.username,
        url: `mattermost://${data.username}@${data.host}/$(password)/${data.channel}`,
        password: data.password,
        properties: {
          host: data.host,
          channel: data.channel
        }
      };
    }
  },
  {
    title: "Matrix",
    forNotification: true,
    value: ConnectionValueType.Matrix,
    icon: "matrix",
    fields: [
      ...commonConnectionFormFields,
      {
        label: "User",
        key: "username",
        hint: "Username or empty when using access token",
        type: ConnectionsFieldTypes.input,
        required: false
      },
      {
        label: "Password",
        key: "password",
        hint: "Password or access token",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Host",
        key: "host",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Insecure TLS",
        key: "insecure_tls",
        type: ConnectionsFieldTypes.checkbox
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        host: data?.properties?.host,
        channel: data?.properties?.channel
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        username: data.username,
        password: data.password,
        insecure_tls: data.insecure_tls,
        url: `matrix://${data.username}:$(password)@${data.host}/?DisableTLS=${data.insecure_tls}`,
        properties: {
          host: data.host
        }
      };
    }
  },
  {
    title: "Ntfy",
    forNotification: true,
    value: ConnectionValueType.Ntfy,
    icon: "ntfy",
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Username",
        key: "username",
        type: ConnectionsFieldTypes.input,
        required: false
      },
      {
        label: "Password",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: false
      },
      {
        label: "Host",
        key: "host",
        hint: "Server hostname and port",
        default: "ntfy.sh",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Topic",
        key: "topic",
        hint: "Target topic name",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Insecure TLS",
        key: "insecure_tls",
        type: ConnectionsFieldTypes.checkbox
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        host: data?.properties?.host,
        topic: data?.properties?.topic
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      const scheme = data.insecure_tls ? "http" : "https";
      return {
        name: data.name,
        username: data.username,
        password: data.password,
        insecure_tls: data.insecure_tls,
        url: `ntfy://${data.username}:$(password)@${data.host}/${data.topic}?Scheme=${scheme}`,
        properties: {
          host: data.host,
          topic: data.topic
        }
      };
    }
  },
  {
    title: "OpsGenie",
    forNotification: true,
    icon: "opsgenie",
    value: ConnectionValueType.OpsGenie,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Host",
        key: "host",
        default: "api.opsgenie.com",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Port",
        key: "port",
        default: 443,
        type: ConnectionsFieldTypes.numberInput,
        required: true
      },
      {
        label: "API Key",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        host: data?.properties?.host,
        port: data?.properties?.port
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        url: `opsgenie://${data.host}:${data.port}/$(password)`,
        password: data.password,
        properties: {
          host: data.host,
          port: data.port
        }
      };
    }
  },
  {
    title: "Pushbullet",
    forNotification: true,
    icon: "pushbullet",
    value: ConnectionValueType.Pushbullet,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Token",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Targets",
        key: "targets",
        type: ConnectionsFieldTypes.input,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        targets: data?.properties?.targets
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        url: `pushbullet://$(password)/${data.targets}`,
        password: data.password,
        properties: {
          targets: data.targets
        }
      };
    }
  },
  {
    title: "Pushover",
    forNotification: true,
    icon: "pushover",
    value: ConnectionValueType.Pushover,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "User",
        key: "username",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Token",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      }
    ],
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        url: `pushover://:$(password)@${data.username}/`,
        username: data.username,
        password: data.password
      };
    }
  },
  {
    title: "Rocketchat",
    forNotification: true,
    icon: "rocket",
    value: ConnectionValueType.Rocketchat,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Username",
        key: "user",
        type: ConnectionsFieldTypes.input,
        required: false
      },
      {
        label: "Host",
        key: "host",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Port",
        key: "port",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Token A",
        key: "username",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Token B",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Channel",
        key: "channel",
        type: ConnectionsFieldTypes.input,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        host: data?.properties?.host,
        port: data?.properties?.port,
        user: data?.properties?.user,
        channel: data?.properties?.channel
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        username: data.username,
        password: data.password,
        url: `rocketchat://${data.user}@${data.host}:${data.port}/$(username)/$(password)/${data.channel}`,
        properties: {
          host: data.host,
          port: data.port,
          user: data.user,
          channel: data.channel
        }
      };
    }
  },
  {
    title: "Slack",
    forNotification: true,
    icon: "slack",
    value: ConnectionValueType.Slack,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Channel",
        key: "username",
        hint: "Channel to send messages to in Cxxxxxxxxxx format",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Bot Token",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Bot Name",
        key: "fromName",
        type: ConnectionsFieldTypes.input,
        required: false
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        fromName: data?.properties?.BotName
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        username: data.username,
        password: data.password,
        url: `slack://$(password)@${data.username}`,
        properties: {
          BotName: data.fromName
        }
      };
    }
  },
  {
    title: "Teams",
    forNotification: true,
    icon: "teams",
    value: ConnectionValueType.Teams,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Group",
        key: "group",
        type: ConnectionsFieldTypes.input,
        required: false
      },
      {
        label: "Tenant",
        key: "tenant",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "AltID",
        key: "altID",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "GroupOwner",
        key: "groupOwner",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Host",
        key: "host",
        type: ConnectionsFieldTypes.input,
        default: "outlook.office.com",
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        group: data?.properties?.group,
        tenant: data?.properties?.tenant,
        altID: data?.properties?.altID,
        host: data?.properties?.host,
        groupOwner: data?.properties?.groupOwner
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        url: `teams://${data.group}@${data.tenant}/${data.altID}/${data.groupOwner}?host=${data.host}`,
        properties: {
          group: data.group,
          tenant: data.tenant,
          altID: data.altID,
          host: data.host,
          groupOwner: data.groupOwner
        }
      };
    }
  },
  {
    title: "Telegram",
    forNotification: true,
    icon: "telegram",
    value: ConnectionValueType.Telegram,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Token",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Chats",
        hitns: "Chat IDs or Channel names (using @channel-name)",
        key: "username",
        type: ConnectionsFieldTypes.input,
        required: true
      }
    ],
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        url: `telegram://$(password)@telegram/?Chats=${data.username}`,
        username: data.username,
        password: data.password
      };
    }
  },
  {
    title: "Zulip Chat",
    forNotification: true,
    icon: "zulip",
    value: ConnectionValueType.ZulipChat,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "BotMail",
        key: "username",
        hint: "Bot e-mail address",
        type: ConnectionsFieldTypes.input,
        required: false
      },
      {
        label: "BotKey",
        key: "password",
        type: ConnectionsFieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Host",
        key: "host",
        type: ConnectionsFieldTypes.input,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        host: data?.properties?.host
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        username: data.username,
        password: data.password,
        url: `zulip://${data.email}:$(password)@${data.host}/`,
        properties: {
          host: data.host
        }
      };
    }
  },
  {
    title: "Generic Webhook",
    forNotification: true,
    icon: "http",
    value: ConnectionValueType.GenericWebhook,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "URL",
        key: "url",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "ContentType",
        default: "application/json",
        key: "contentType",
        type: ConnectionsFieldTypes.input
      },
      {
        label: "Request Method",
        key: "requestMethod",
        type: ConnectionsFieldTypes.SwitchField,
        default: "POST",
        switchFieldProps: {
          options: [
            {
              label: "POST",
              key: "POST"
            },
            {
              label: "GET",
              key: "GET"
            }
          ]
        },
        required: true
      },
      {
        label: "Message Key",
        default: "message",
        key: "key",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Title Key",
        default: "title",
        key: "titleKey",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Insecure TLS",
        key: "insecure_tls",
        type: ConnectionsFieldTypes.checkbox
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        contentType: data?.properties?.contentType,
        requestMethod: data?.properties?.requestMethod,
        key: data?.properties?.key,
        titleKey: data?.properties?.titleKey
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        username: data.username,
        url: `generic+${data.username}?ContentType=${data.contentType}&MessageKey=${data.key}&TitleKey=${data.titleKey}&RequestMethod=${data.requestMethod}&DisableTLS=${data.insecure_tls}`,
        insecure_tls: data.insecure_tls,
        properties: {
          contentType: data.contentType,
          requestMethod: data.requestMethod,
          key: data.key,
          titleKey: data.titleKey
        }
      };
    }
  },
  {
    title: "Folder",
    icon: "folder",
    value: ConnectionValueType.Folder,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "Path",
        key: "path",
        type: ConnectionsFieldTypes.input,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        path: data?.properties?.path
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        namespace: data.namespace,
        properties: {
          path: data.path
        }
      };
    }
  },
  {
    title: "Git",
    icon: "git",
    value: ConnectionValueType.Git,
    fields: [
      ...commonConnectionFormFields,
      {
        label: "URL",
        key: "url",
        type: ConnectionsFieldTypes.input,
        required: true
      },
      {
        label: "Authentication",
        key: "authentication",
        type: ConnectionsFieldTypes.ConnectionSwitch,
        default: "password",
        options: [
          {
            label: "Basic",
            key: "password",
            fields: [
              {
                label: "Username",
                key: "username",
                type: ConnectionsFieldTypes.Authentication
              },
              {
                label: "Password",
                key: "password",
                type: ConnectionsFieldTypes.Authentication
              }
            ]
          },
          {
            label: "SSH",
            key: "certificate",
            fields: [
              {
                label: "SSH Key",
                hideLabel: true,
                key: "certificate",
                type: ConnectionsFieldTypes.EnvVarSource,
                variant: variants.large
              }
            ]
          }
        ]
      },
      {
        label: "Ref",
        default: "main",
        key: "ref",
        type: ConnectionsFieldTypes.input,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        ref: data?.properties?.ref ?? "ref"
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        url: data.url,
        namespace: data.namespace,
        password: data.password,
        username: data.username,
        certificate: data.certificate,
        properties: {
          ref: data.ref
        }
      };
    }
  }
]
  .sort((v1, v2) => {
    return stringSortHelper(v1.title, v2.title);
  })
  .filter((item) => !item.hide);