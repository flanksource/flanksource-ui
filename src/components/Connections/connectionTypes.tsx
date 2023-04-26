import { FaWindows } from "react-icons/fa";
import { DiGoogleCloudPlatform } from "react-icons/di";
import { stringSortHelper } from "../../utils/common";
import { Connection } from "./ConnectionForm";

type FieldType = "checkbox" | "input" | "certificate" | "EnvVarSource";

const fieldTypes: { [key: string]: FieldType } = {
  certificate: "certificate",
  checkbox: "checkbox",
  input: "input",
  EnvVarSource: "EnvVarSource"
};

type Variant = "small" | "large";

const variants: { [key: string]: Variant } = {
  small: "small",
  large: "large"
};

export type Field = {
  label: string;
  key: string;
  type: string;
  variant?: Variant;
};

export type ConnectionType = {
  title: string;
  icon?: React.ReactNode | string | null;
  fields: Field[];
  convertToFormSpecificValue?: (data: Record<string, string>) => Connection;
  preSubmitConverter?: (data: Record<string, string>) => object;
};

export const connectionTypes: ConnectionType[] = [
  {
    title: "Postgres",
    icon: "http",
    fields: [
      {
        label: "URL",
        key: "url",
        type: fieldTypes.input
      },
      {
        label: "Username",
        key: "username",
        type: fieldTypes.EnvVarSource
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.EnvVarSource
      }
    ]
  },
  {
    title: "MySQL",
    icon: "mysql",
    fields: [
      {
        label: "URL",
        key: "url",
        type: fieldTypes.input
      },
      {
        label: "Username",
        key: "username",
        type: fieldTypes.EnvVarSource
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.EnvVarSource
      }
    ]
  },
  {
    title: "SQL Server",
    icon: "sqlserver",
    fields: [
      {
        label: "URL",
        key: "url",
        type: fieldTypes.input
      },
      {
        label: "Username",
        key: "username",
        type: fieldTypes.EnvVarSource
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.EnvVarSource
      }
    ]
  },
  {
    title: "HTTP",
    icon: "http",
    fields: [
      {
        label: "URL",
        key: "url",
        type: fieldTypes.input
      },
      {
        label: "Username",
        key: "username",
        type: fieldTypes.EnvVarSource
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.EnvVarSource
      },
      {
        label: "Insecure TLS",
        key: "insecure_tls",
        type: fieldTypes.checkbox
      }
    ]
  },
  {
    title: "Prometheus",
    icon: "prometheus",
    fields: [
      {
        label: "URL",
        key: "url",
        type: fieldTypes.input
      },
      {
        label: "Username",
        key: "username",
        type: fieldTypes.EnvVarSource
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.EnvVarSource
      },
      {
        label: "Insecure TLS",
        key: "insecure_tls",
        type: fieldTypes.checkbox
      }
    ]
  },
  {
    title: "Elasticsearch",
    icon: "elasticsearch",
    fields: [
      {
        label: "URL",
        key: "url",
        type: fieldTypes.input
      },
      {
        label: "Username",
        key: "username",
        type: fieldTypes.EnvVarSource
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.EnvVarSource
      },
      {
        label: "Insecure TLS",
        key: "insecure_tls",
        type: fieldTypes.checkbox
      }
    ]
  },
  {
    title: "Mongo",
    icon: "mongo",
    fields: [
      {
        label: "URL",
        key: "url",
        type: fieldTypes.input
      },
      {
        label: "Username",
        key: "username",
        type: fieldTypes.EnvVarSource
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.EnvVarSource
      },
      {
        label: "Insecure TLS",
        key: "insecure_tls",
        type: fieldTypes.checkbox
      }
    ]
  },
  {
    title: "LDAP",
    icon: "ldap",
    fields: [
      {
        label: "URL",
        key: "url",
        type: fieldTypes.input
      },
      {
        label: "Username",
        key: "username",
        type: fieldTypes.EnvVarSource
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.EnvVarSource
      },
      {
        label: "Insecure TLS",
        key: "insecure_tls",
        type: fieldTypes.checkbox
      }
    ]
  },
  {
    title: "Redis",
    icon: "redis",
    fields: [
      {
        label: "URL",
        key: "url",
        type: fieldTypes.input
      },
      {
        label: "Username",
        key: "username",
        type: fieldTypes.EnvVarSource
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.EnvVarSource
      },
      {
        label: "Insecure TLS",
        key: "insecure_tls",
        type: fieldTypes.checkbox
      }
    ]
  },
  {
    title: "Windows",
    icon: <FaWindows className="w-5 h-5" />,
    fields: [
      {
        label: "URL",
        key: "url",
        type: fieldTypes.input
      },
      {
        label: "Username",
        key: "username",
        type: fieldTypes.EnvVarSource
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.EnvVarSource
      },
      {
        label: "Domain",
        key: "domain",
        type: fieldTypes.input
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        domain: data.properties?.domain
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
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
    icon: <DiGoogleCloudPlatform className="w-6 h-6" />,
    fields: [
      {
        label: "Certificate",
        key: "certificate",
        type: fieldTypes.EnvVarSource,
        variant: variants.large
      }
    ]
  },
  {
    title: "SFTP",
    icon: "sftp",
    fields: [
      {
        label: "Host",
        key: "host",
        type: fieldTypes.input
      },
      {
        label: "Username",
        key: "username",
        type: fieldTypes.input
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.input
      },
      {
        label: "Port",
        key: "port",
        type: fieldTypes.input
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      const regex = /(.+)?:(.+)?@(.+)?:(.+)/;
      const result = data.url.replace("sftp://", "").match(regex) || [];
      return {
        ...data,
        username: result[1],
        password: result[2],
        host: result[3],
        port: result[4]
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        url: `sftp://${data.username}:${data.password}@${data.host}:${data.port}`
      };
    }
  },
  {
    title: "AWS",
    icon: "aws",
    fields: [
      {
        label: "Region",
        key: "region",
        type: fieldTypes.input
      },
      {
        label: "Profile",
        key: "profile",
        type: fieldTypes.input
      },
      {
        label: "Access Key",
        key: "username",
        type: fieldTypes.EnvVarSource
      },
      {
        label: "Secret Key",
        key: "password",
        type: fieldTypes.EnvVarSource
      },
      {
        label: "Insecure TLS",
        key: "insecure_tls",
        type: fieldTypes.checkbox
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        region: data.properties?.region,
        profile: data.properties?.profile,
        insecure_tls: data.properties?.insecureTLS
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
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
    title: "Kubernetes",
    icon: "kubernetes",
    fields: [
      {
        label: "Certificate",
        key: "certificate",
        type: fieldTypes.EnvVarSource,
        variant: variants.large
      }
    ]
  },
  {
    title: "Azure Devops",
    icon: "azure-devops",
    fields: [
      {
        label: "Organization",
        key: "username",
        type: fieldTypes.input
      },
      {
        label: "Personal Access Token",
        key: "password",
        type: fieldTypes.EnvVarSource
      }
    ]
  }
].sort((v1, v2) => {
  return stringSortHelper(v1.title, v2.title);
});
