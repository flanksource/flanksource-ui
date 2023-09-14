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

  /** indicates whether this connection is primarily for notification */
  forNotification?: boolean;
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
    title: "Discord",
    forNotification: true,
    icon: "discord",
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
        key: "password",
        type: fieldTypes.EnvVarSource,
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
        hint: "SMTP server password or hash (for OAuth2)",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "From Address",
        key: "from",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "From Name",
        key: "fromName",
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
        label: "Port",
        key: "port",
        type: fieldTypes.numberInput,
        default: 25,
        required: true
      },
      {
        label: "Encryption method",
        key: "encryptionMethod",
        type: fieldTypes.input,
        hint: "None, ExplicitTLS, ImplicitTLS, Auto (default)",
        default: "Auto",
        required: true
      },
      {
        label: "SMTP authentication method",
        key: "authMethod",
        type: fieldTypes.input,
        hint: "None, Plain, CRAMMD5, Unknown, OAuth2",
        default: "Unknown",
        required: true
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
        authMethod: data.properties?.authMethod,
        encryptionMethod: data.properties?.encryptionMethod,
        from: data.properties?.from,
        fromName: data.properties?.fromName,
        host: data.properties?.host,
        port: data.properties?.port
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
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Key",
        key: "username",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Token",
        key: "password",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Webhook Name",
        key: "webhook",
        type: fieldTypes.input,
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        webhook: data.properties?.webhook
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
        hint: "Mattermost server host (host:port)",
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
    icon: "matrix",
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
        label: "Password",
        key: "password",
        hint: "Password or access token",
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
        label: "Insecure TLS",
        key: "insecure_tls",
        type: fieldTypes.checkbox
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
    icon: "ntfy",
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
        required: false
      },
      {
        label: "Host",
        key: "host",
        hint: "Server hostname and port",
        default: "ntfy.sh",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Topic",
        key: "topic",
        hint: "Target topic name",
        type: fieldTypes.input,
        required: true
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
        host: data.properties?.host,
        topic: data.properties?.topic
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
        default: "api.opsgenie.com",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Port",
        key: "port",
        default: 443,
        type: fieldTypes.numberInput,
        required: true
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
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Username",
        key: "user",
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
        key: "username",
        type: fieldTypes.EnvVarSource,
        required: true
      },
      {
        label: "Token B",
        key: "password",
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
        user: data.properties?.user,
        channel: data.properties?.channel
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
      },
      {
        label: "Bot Name",
        key: "fromName",
        type: fieldTypes.input,
        required: false
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        fromName: data.properties?.BotName
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
      },
      {
        label: "Host",
        key: "host",
        type: fieldTypes.input,
        default: "outlook.office.com",
        required: true
      }
    ],
    convertToFormSpecificValue: (data: Record<string, any>) => {
      return {
        ...data,
        group: data.properties?.group,
        tenant: data.properties?.tenant,
        altID: data.properties?.altID,
        host: data.properties?.host,
        groupOwner: data.properties?.groupOwner
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
        label: "Chats",
        hitns: "Chat IDs or Channel names (using @channel-name)",
        key: "username",
        type: fieldTypes.input,
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
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "BotMail",
        key: "username",
        hint: "Bot e-mail address",
        type: fieldTypes.input,
        required: false
      },
      {
        label: "BotKey",
        key: "password",
        type: fieldTypes.EnvVarSource,
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
        host: data.properties?.host
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
    fields: [
      {
        label: "Name",
        key: "name",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "URL",
        key: "username",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "ContentType",
        default: "application/json",
        key: "contentType",
        type: fieldTypes.input
      },
      {
        label: "Request Method",
        key: "requestMethod",
        type: fieldTypes.input,
        default: "POST",
        required: true
      },
      {
        label: "Message Key",
        default: "message",
        key: "key",
        type: fieldTypes.input,
        required: true
      },
      {
        label: "Title Key",
        default: "title",
        key: "titleKey",
        type: fieldTypes.input,
        required: true
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
        contentType: data.properties?.contentType,
        requestMethod: data.properties?.requestMethod,
        key: data.properties?.key,
        titleKey: data.properties?.titleKey
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
          message: data.message,
          titleKey: data.titleKey
        }
      };
    }
  }
]
  .sort((v1, v2) => {
    return stringSortHelper(v1.title, v2.title);
  })
  .filter((item) => !item.hide);
