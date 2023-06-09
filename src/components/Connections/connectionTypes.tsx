import { FaWindows } from "react-icons/fa";
import { DiGoogleCloudPlatform } from "react-icons/di";
import { stringSortHelper } from "../../utils/common";
import { Connection } from "./ConnectionForm";

const fieldTypes = {
  checkbox: "checkbox",
  input: "input",
  numberInput: "numberInput",
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
  required?: boolean;
  default?: boolean | number | string;
};

export type ConnectionType = {
  title: string;
  icon?: React.ReactNode | string | null;
  fields: Field[];
  convertToFormSpecificValue?: (data: Record<string, string>) => Connection;
  preSubmitConverter?: (data: Record<string, string>) => object;
  hide?: boolean;
};

export const connectionTypes: ConnectionType[] = [
  {
    title: "Postgres",
    icon: "postgres",
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "URL",
        key: "url",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Username",
        key: "username",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: true
      }
    ]
  },
  {
    title: "MySQL",
    icon: "mysql",
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "URL",
        key: "url",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Username",
        key: "username",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: true
      }
    ]
  },
  {
    title: "SQL Server",
    icon: "sqlserver",
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "URL",
        key: "url",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Username",
        key: "username",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: true
      }
    ]
  },
  {
    title: "HTTP",
    icon: "http",
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "URL",
        key: "url",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Username",
        key: "username",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: true
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
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "URL",
        key: "url",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Username",
        key: "username",
        type: fieldTypes.EnvVarSource,
        required: false
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: false
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
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "URL",
        key: "url",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Username",
        key: "username",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: true
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
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "URL",
        key: "url",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Username",
        key: "username",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: true
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
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "URL",
        key: "url",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Username",
        key: "username",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: true
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
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Database",
        key: "db",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "URL",
        key: "url",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Username",
        key: "username",
        type: fieldTypes.EnvVarSource,
        required: false
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: false
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
        db: data.properties?.db
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
    icon: <FaWindows className="w-5 h-5" />,
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Username",
        key: "username",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Domain",
        key: "domain",
        type: fieldTypes.input,
        required: false
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
    icon: <DiGoogleCloudPlatform className="w-6 h-6" />,
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Endpoint",
        key: "url",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Certificate",
        key: "certificate",
        type: fieldTypes.EnvVarSource,
        variant: variants.large,
        required: true
      }
    ]
  },
  {
    title: "SFTP",
    icon: "sftp",
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Host",
        key: "host",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Username",
        key: "username",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Port",
        key: "port",
        type: fieldTypes.input,
        required: false
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
        name: data.name,
        url: `sftp://${data.username}:${data.password}@${data.host}:${data.port}`
      };
    }
  },
  {
    title: "AWS",
    icon: "aws",
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Region",
        key: "region",
        type: fieldTypes.input,
        required: false
      },
      {
        label: "Profile",
        key: "profile",
        type: fieldTypes.input,
        required: false
      },
      {
        label: "Access Key",
        key: "username",
        type: fieldTypes.EnvVarSource,
        required: false
      },
      {
        label: "Secret Key",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: false
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
    title: "Kubernetes",
    icon: "kubernetes",
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Certificate",
        key: "certificate",
        type: fieldTypes.EnvVarSource,
        variant: variants.large,
        required: false
      }
    ]
  },
  {
    title: "Azure Devops",
    icon: "azure-devops",
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Organization",
        key: "username",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Personal Access Token",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: true
      }
    ]
  },
  {
    title: "Azure",
    icon: "azure",
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Client ID",
        key: "username",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Client Secret",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Tenant ID",
        key: "tenant",
        type: fieldTypes.input,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        tenant: data.properties?.tenant
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
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Personal Access Token",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: true
      }
    ]
  },
  {
    title: "Restic",
    icon: "restic",
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Repository URL",
        key: "url",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "AWS Connection Name",
        key: "awsConnectionName",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Access Key",
        key: "accessKey",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Secret Key",
        key: "secretKey",
        type: fieldTypes.EnvVarSource,
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
    hide: true,
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Username",
        key: "username",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Workstation",
        key: "workstation",
        type: fieldTypes.input
      },
      {
        label: "Share name",
        key: "sharename",
        type: fieldTypes.input
      },
      {
        label: "Search path",
        key: "searchPath",
        type: fieldTypes.input
      },
      {
        label: "Port",
        key: "port",
        type: fieldTypes.numberInput,
        default: 445
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        workstation: data.properties?.workstation,
        sharename: data.properties?.sharename,
        searchPath: data.properties?.searchPath,
        port: data.properties?.port
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
    hide: true,
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Host",
        key: "url",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Port",
        key: "port",
        type: fieldTypes.numberInput
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        port: data.properties?.port
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
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Host",
        key: "url",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "API Key",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Scheme",
        key: "scheme",
        type: fieldTypes.input,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        scheme: data.properties?.scheme
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
  }
]
  .sort((v1, v2) => {
    return stringSortHelper(v1.title, v2.title);
  })
  .filter((item) => !item.hide);
