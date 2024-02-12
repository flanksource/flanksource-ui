import { SchemaResourceType } from "./../SchemaResourcePage/resourceTypes";

export type EventQueueStatus = {
  table: SchemaResourceType["table"];
  error_count: number;
  average_attempts: number;
  first_failure: string;
  latest_failure: null | string;
  most_common_error: string;
};

export type EventQueueSummary = {
  name: string;
  pending?: number;
  failed?: number;
  average_attempts?: number;
  first_failure?: string;
  last_failure?: string;
  most_common_error?: string;
};
