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
  hint?: string;
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
  },
  {
    title: "Bark",
    icon: "bark", // TODO: add icon
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Device Key",
        key: "username",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Host",
        key: "host",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Path",
        key: "path",
        type: fieldTypes.input,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        path: data.properties?.path,
        host: data.properties?.host
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        username: data.username,
        password: data.password,
        properties: {
          path: data.path,
          host: data.host
        }
      };
    }
  },
  {
    title: "Discord",
    icon: "discord", // TODO: add icon
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Webhook ID",
        key: "username",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Token",
        key: "username",
        type: fieldTypes.EnvVarSource,
        required: true
      }
    ]
  },
  {
    title: "Email",
    icon: "gmail", // TODO: add icon
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
        type: fieldTypes.EnvVarSource,
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
        type: fieldTypes.input,
        required: true
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
        username: data.username,
        password: data.password,
        properties: {
          port: data.port
        }
      };
    }
  },
  {
    title: "Gotify",
    icon: "gotify", // TODO: add icon
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
        label: "Token",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Path",
        key: "path",
        type: fieldTypes.input,
        required: false
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        path: data.properties?.path
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        url: data.url,
        password: data.password,
        properties: {
          path: data.path
        }
      };
    }
  },
  {
    title: "Google Chat",
    icon: "google", // TODO: add icon
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Webhook Name",
        key: "username",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Token",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Key",
        key: "key",
        type: fieldTypes.EnvVarSource,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        key: data.properties?.key
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        username: data.username,
        password: data.password,
        properties: {
          key: data.key
        }
      };
    }
  },
  {
    title: "IFTTT",
    icon: "ifttt", // TODO: add icon
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Webhook ID",
        key: "username",
        type: fieldTypes.input,
        required: true
      }
    ]
  },
  {
    title: "Join",
    icon: "join", // TODO: add icon
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "API Key",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: true
      }
    ]
  },
  {
    title: "Mattermost",
    icon: "mattermost", // TODO: add icon
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
        hint: "Override webhook user",
        type: fieldTypes.input,
        required: false
      },
      {
        label: "Host",
        key: "host",
        hint: "Mattermost server host",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Token",
        key: "password",
        hint: "Webhook token",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Channel",
        key: "channel",
        hint: "Override webhook channel",
        type: fieldTypes.input,
        required: false
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        host: data.properties?.host,
        channel: data.properties?.channel
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        username: data.username,
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
    icon: "matrix", // TODO: add icon
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "User",
        key: "username",
        hint: "Username or empty when using access token",
        type: fieldTypes.input,
        required: false
      },
      {
        label: "Host",
        key: "host",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Password",
        key: "password",
        hint: "Password or access token",
        type: fieldTypes.EnvVarSource,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        host: data.properties?.host,
        channel: data.properties?.channel
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        username: data.username,
        password: data.password,
        properties: {
          host: data.host,
          channel: data.channel
        }
      };
    }
  },
  {
    title: "Ntfy",
    icon: "ntfy", // TODO: add icon
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
        required: false
      },
      {
        label: "Password",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Host",
        key: "host",
        hint: "Ntfy server host. Default: ntfy.sh",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Port",
        key: "port",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Topic",
        key: "topic",
        hint: "Target topic name",
        type: fieldTypes.EnvVarSource,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        host: data.properties?.host,
        topic: data.properties?.topic,
        port: data.properties?.port
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        username: data.username,
        password: data.password,
        properties: {
          host: data.host,
          topic: data.topic,
          port: data.port
        }
      };
    }
  },
  {
    title: "OpsGenie",
    icon: "opsgenie", // TODO: add icon
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
        required: false
      },
      {
        label: "Port",
        key: "port",
        type: fieldTypes.numberInput,
        required: false
      },
      {
        label: "API Key",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        host: data.properties?.host,
        port: data.properties?.port
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        username: data.username,
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
    icon: "pushbullet", // TODO: add icon
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Token",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Targets",
        key: "targets",
        type: fieldTypes.input,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        targets: data.properties?.targets
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        username: data.username,
        password: data.password,
        properties: {
          targets: data.targets
        }
      };
    }
  },
  {
    title: "Pushover",
    icon: "pushover", // TODO: add icon
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "User",
        key: "username",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Token",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: true
      }
    ]
  },
  {
    title: "Rocketchat",
    icon: "rocketchat", // TODO: add icon
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
        required: false
      },
      {
        label: "Host",
        key: "host",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Port",
        key: "port",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Token A",
        key: "tokenA",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Token B",
        key: "tokenB",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Channel",
        key: "channel",
        type: fieldTypes.input,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        host: data.properties?.host,
        port: data.properties?.port,
        tokenA: data.properties?.tokenA,
        tokenB: data.properties?.tokenB,
        channel: data.properties?.channel
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        username: data.username,
        password: data.password,
        properties: {
          host: data.host,
          port: data.port,
          tokenA: data.tokenA,
          tokenB: data.tokenB,
          channel: data.channel
        }
      };
    }
  },
  {
    title: "Slack",
    icon: "slack",
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Channel",
        key: "username",
        hint: "Channel to send messages to in Cxxxxxxxxxx format",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Bot Token",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: true
      }
    ]
  },
  {
    title: "Teams",
    icon: "teams",
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Group",
        key: "group",
        type: fieldTypes.input,
        required: false
      },
      {
        label: "Tenant",
        key: "tenant",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "AltID",
        key: "altID",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "GroupOwner",
        key: "groupOwner",
        type: fieldTypes.input,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        group: data.properties?.group,
        tenant: data.properties?.tenant,
        altID: data.properties?.altID,
        groupOwner: data.properties?.groupOwner
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        properties: {
          group: data.group,
          tenant: data.tenant,
          altID: data.altID,
          groupOwner: data.groupOwner
        }
      };
    }
  },
  {
    title: "Telegram",
    icon: "telegram", // TODO: add icon
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Token",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: true
      }
    ]
  },
  {
    title: "Zulip Chat",
    icon: "zuplichat", // TODO: add icon
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "BotMail",
        key: "email",
        hint: "Bot e-mail address",
        type: fieldTypes.input,
        required: false
      },
      {
        label: "BotKey",
        key: "key",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Host",
        key: "host",
        type: fieldTypes.input,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        host: data.properties?.host,
        key: data.properties?.key,
        email: data.properties?.email
      } as Connection;
    },
    preSubmitConverter: (data: Record<string, string>) => {
      return {
        name: data.name,
        properties: {
          host: data.host,
          key: data.key,
          email: data.email
        }
      };
    }
  },
  {
    title: "Generic Webhook",
    icon: "http", // TODO: add icon
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
      }
    ]
  }
]
  .sort((v1, v2) => {
    return stringSortHelper(v1.title, v2.title);
  })
  .filter((item) => !item.hide);
