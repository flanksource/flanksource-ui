import { SchemaResourceType } from "./../SchemaResourcePage/resourceTypes";

export type EventQueueStatus = {
  table: SchemaResourceType["table"];
  error_count: number;
  average_attempts: number;
  first_failure: string;
  latest_failure: null | string;
  most_common_error: string;
};
