export const tables = {
  database: "database",
  rbac: "rbac",
  auth: "auth",
  responder: "responder",
  incident: "incident",
  evidences: "evidences",
  comments: "comments",
  canaries: "canaries",
  topologies: "topologies",
  config_scrapers: "config_scrapers",
  identities: "identities",
  connections: "connections",
  kratos: "kratos",
  agents: "agents",
  feature_flags: "properties",
  logging_backends: "logging_backends",
  integrations: "integrations",
  notifications: "notifications",
  playbooks: "playbooks",
  playbook_runs: "playbook_runs"
};

export const permDefs = {
  admin: {
    read: [...Object.values(tables)],
    write: [...Object.values(tables)]
  },
  editor: {
    read: [
      ...Object.values(tables).filter(
        (item) =>
          ![tables.connections, tables.identities, tables.rbac].includes(item)
      )
    ],
    write: [
      ...Object.values(tables).filter(
        (item) =>
          ![tables.connections, tables.identities, tables.rbac].includes(item)
      )
    ]
  },
  commander: {
    read: [
      ...Object.values(tables).filter(
        (v) => ![tables.rbac, tables.identities, tables.connections].includes(v)
      )
    ],
    write: [
      tables.responder,
      tables.incident,
      tables.evidences,
      tables.comments
    ]
  },
  responder: {
    read: [
      ...Object.values(tables).filter(
        (v) => ![tables.rbac, tables.identities, tables.connections].includes(v)
      )
    ],
    write: [
      tables.responder,
      tables.incident,
      tables.evidences,
      tables.comments
    ]
  },
  viewer: {
    read: [
      ...Object.values(tables).filter(
        (v) => ![tables.rbac, tables.identities, tables.connections].includes(v)
      )
    ],
    write: []
  }
};
