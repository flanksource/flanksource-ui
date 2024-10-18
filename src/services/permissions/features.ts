export const features = {
  topology: "topology",
  health: "health",
  incidents: "incidents",
  config: "config",
  logs: "logs",
  playbooks: "playbooks",
  agents: "agents",
  "settings.connections": "settings.connections",
  "settings.users": "settings.users",
  "settings.teams": "settings.teams",
  "settings.rules": "settings.rules",
  "settings.config_scraper": "settings.config_scraper",
  "settings.topology": "settings.topology",
  "settings.health": "settings.health",
  "settings.job_history": "settings.job_history",
  "settings.feature_flags": "settings.feature_flags",
  "settings.logging_backends": "settings.logging_backends",
  "settings.event_queue_status": "settings.event_queue_status",
  "settings.organization_profile": "settings.organization_profile",
  "settings.notifications": "settings.notifications",
  "settings.playbooks": "settings.playbooks",
  "settings.integrations": "settings.integrations",
  "settings.permissions": "settings.permissions"
} as const;

export const featureToParentMap = {
  "settings.config_scraper": "config",
  "settings.topology": "topology",
  "settings.health": "health",
  "settings.job_history": "health"
} as const;

export const featuresList = Object.keys(features).map(
  (item) => `${item}.disable`
);
