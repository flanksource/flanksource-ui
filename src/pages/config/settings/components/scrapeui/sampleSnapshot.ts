export const sampleScrapeSnapshot = {
  scrapers: [
    {
      name: "azure-scraper",
      status: "complete",
      result_count: 2,
      duration_secs: 3.42
    }
  ],
  results: {
    configs: [
      {
        id: "vm-01",
        name: "vm-01",
        config_type: "VM",
        health: "healthy",
        tags: {
          namespace: "default"
        },
        config: {
          id: "vm-01",
          region: "eastus"
        }
      },
      {
        id: "db-01",
        name: "db-01",
        config_type: "Database",
        health: "warning",
        tags: {
          namespace: "default"
        },
        config: {
          id: "db-01",
          engine: "postgres"
        }
      }
    ],
    changes: [
      {
        change_type: "updated",
        summary: "Database engine version changed",
        config_type: "Database",
        external_id: "db-01",
        severity: "medium",
        created_at: new Date().toISOString()
      }
    ],
    analysis: [],
    relationships: [],
    external_users: [],
    external_groups: [],
    external_roles: [],
    external_user_groups: [],
    config_access: [],
    config_access_logs: []
  },
  relationships: [],
  config_meta: {
    "vm-01": {
      parents: ["resource-group-a"],
      location: "eastus"
    }
  },
  issues: [],
  counts: {
    configs: 2,
    changes: 1,
    analysis: 0,
    relationships: 0,
    external_users: 0,
    external_groups: 0,
    external_roles: 0,
    config_access: 0,
    access_logs: 0,
    errors: 0
  },
  save_summary: {
    config_types: {
      VM: {
        added: 1,
        updated: 0,
        unchanged: 0,
        changes: 0
      },
      Database: {
        added: 0,
        updated: 1,
        unchanged: 0,
        changes: 1
      }
    }
  },
  logs: "[info] scrape started\n[info] scrape finished",
  done: true,
  started_at: Date.now() - 4000
};
