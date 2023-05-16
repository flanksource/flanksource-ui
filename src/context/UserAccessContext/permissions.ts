export const tables = {
  database: "database",
  rbac: "rbac",
  auth: "auth",
  responder: "responder",
  incident: "incident",
  evidences: "evidences",
  comments: "comments",
  canaries: "canaries",
  system_templates: "system_templates",
  config_scrapers: "config_scrapers",
  identities: "identities",
  connections: "connections",
  kratos: "kratos"
};

export const permDefs = {
  admin: {
    read: [...Object.values(tables)],
    write: [...Object.values(tables)]
  },
  editor: {
    read: [tables.canaries, tables.system_templates, tables.config_scrapers],
    write: [tables.canaries, tables.system_templates, tables.config_scrapers]
  },
  commander: {
    read: [tables.responder, tables.incident, tables.evidences],
    write: [tables.responder, tables.incident, tables.evidences]
  },
  responder: {
    read: [tables.comments, tables.incident],
    write: [tables.comments, tables.incident]
  },
  viewer: {
    read: [
      ...Object.values(tables).filter(
        (v) => ![tables.rbac, tables.identities].includes(v)
      )
    ],
    write: []
  }
};
