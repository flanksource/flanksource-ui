---
name: data-table-builder
description: Read when working with filters in the data table
---

- Never query the entire table and then filter client-side to populate the filter dropdown options.
  Create a view in duty/ repo instead that returns options for all the filters at once.
  Reference: `config_access_summary_by_user` view in views/038_config_access.sql
