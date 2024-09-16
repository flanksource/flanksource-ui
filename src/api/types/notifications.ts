export type SilenceNotificationResponse = {
  id: string;
  component_id: string;
  config_id: string;
  check_id: string;
  canary_id: string;
  from: string;
  until: string;
  description: string;
  recursive: boolean;
};
