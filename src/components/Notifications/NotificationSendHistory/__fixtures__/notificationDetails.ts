import { NotificationSendHistoryDetailApiResponse } from "@flanksource-ui/api/types/notifications";

const now = "2026-07-09T08:00:00.000Z";

export const sentPodNotification: NotificationSendHistoryDetailApiResponse = {
  id: "sent-pod-history-id",
  notification_id: "notification-rule-id",
  body: "Pod airsonic-7f9d4b9d9c-l6ptw is unhealthy",
  body_payload: null,
  status: "sent",
  count: 1,
  first_observed: now,
  source_event: "config.unhealthy",
  resource_id: "pod-resource-id",
  playbook_run_id: undefined,
  person_id: undefined,
  connection_id: undefined,
  error: undefined,
  duration_millis: 250,
  created_at: now,
  parent_id: undefined,
  resource_health: "unhealthy",
  resource_status: "CrashLoopBackOff",
  resource_health_description:
    "Pod airsonic-7f9d4b9d9c-l6ptw is in CrashLoopBackOff",
  resource_kind: "config",
  resource_type: "Kubernetes::Pod",
  resource: {
    id: "pod-resource-id",
    name: "airsonic-7f9d4b9d9c-l6ptw",
    type: "Kubernetes::Pod",
    health: "unhealthy",
    status: "CrashLoopBackOff",
    config_class: "Pod",
    tags: {
      namespace: "default"
    }
  },
  playbook_run: undefined as any,
  person: undefined as any,
  body_markdown: "Pod airsonic-7f9d4b9d9c-l6ptw is unhealthy"
};

export const inhibitedDeploymentNotification: NotificationSendHistoryDetailApiResponse =
  {
    id: "inhibited-deployment-history-id",
    notification_id: "notification-rule-id",
    body: "Deployment airsonic is unhealthy",
    body_payload: null,
    status: "inhibited",
    count: 1,
    first_observed: now,
    source_event: "config.unhealthy",
    silenced_by: undefined,
    resource_id: "deployment-resource-id",
    playbook_run_id: undefined,
    person_id: undefined,
    connection_id: undefined,
    error: undefined,
    duration_millis: 25,
    created_at: now,
    parent_id: sentPodNotification.id,
    resource_health: "unhealthy",
    resource_status: "Unavailable",
    resource_health_description: "Deployment airsonic has unavailable replicas",
    resource_kind: "config",
    resource_type: "Kubernetes::Deployment",
    resource: {
      id: "deployment-resource-id",
      name: "airsonic",
      type: "Kubernetes::Deployment",
      health: "unhealthy",
      status: "Unavailable",
      config_class: "Deployment",
      tags: {
        namespace: "default"
      }
    },
    playbook_run: undefined as any,
    person: undefined as any,
    body_markdown: "Deployment airsonic is unhealthy"
  };

export const sentDeploymentNotification: NotificationSendHistoryDetailApiResponse =
  {
    ...inhibitedDeploymentNotification,
    id: "sent-deployment-history-id",
    status: "sent",
    parent_id: undefined
  };
