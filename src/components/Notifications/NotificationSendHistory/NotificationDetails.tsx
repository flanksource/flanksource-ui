import {
  NotificationSendHistoryApiResponse,
  NotificationSendHistoryDetailApiResponse
} from "@flanksource-ui/api/types/notifications";
import { Age } from "@flanksource-ui/ui/Age";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";
import VerticalDescription from "@flanksource-ui/ui/description/VerticalDescription";
import { formatDuration } from "@flanksource-ui/utils/date";
import clsx from "clsx";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import NotificationResourceDisplay from "../NotificationResourceDisplay";
import { notificationSendHistoryStatus } from "../NotificationsStatusCell";
import blockKitToMarkdown, { SlackMessage } from "@flanksource-ui/utils/slack";
import { DisplayMarkdown } from "@flanksource-ui/components/Utils/Markdown";
import { getNotificationSilencesByID } from "@flanksource-ui/api/services/notifications";
import { useQuery } from "@tanstack/react-query";
import { Status } from "@flanksource-ui/components/Status";
import { sanitizeHTMLContent } from "@flanksource-ui/utils/common";

type NotificationDetailsProps = {
  notification:
    | NotificationSendHistoryApiResponse
    | NotificationSendHistoryDetailApiResponse;
  onClose?: () => void;
};

export default function NotificationDetails({
  notification,
  onClose = () => {}
}: NotificationDetailsProps) {
  const status = notification.status;
  const statusConfig =
    notificationSendHistoryStatus[
      status as keyof typeof notificationSendHistoryStatus
    ];

  const error = useMemo(() => {
    if (!notification?.error) {
      return undefined;
    }
    try {
      return JSON.stringify(JSON.parse(notification.error), null, 2);
    } catch (e) {
      return notification.error;
    }
  }, [notification]);

  const readableTime = notification.duration_millis
    ? formatDuration(notification.duration_millis)
    : undefined;

  const bodyMarkdown =
    "body_markdown" in notification ? notification.body_markdown : undefined;

  // Legacy notifications stored Slack BlockKit JSON directly in the summary body field.
  const legacyBody = notification.body;

  const legacySlackMessage = useMemo<SlackMessage | undefined>(() => {
    if (bodyMarkdown || !legacyBody) {
      return undefined;
    }

    try {
      const parsed = JSON.parse(legacyBody.trim()) as
        | SlackMessage
        | SlackMessage[];

      if (Array.isArray(parsed)) {
        const [firstMessage] = parsed;
        return Array.isArray(firstMessage?.blocks) ? firstMessage : undefined;
      }

      return Array.isArray(parsed?.blocks) ? parsed : undefined;
    } catch {
      return undefined;
    }
  }, [bodyMarkdown, legacyBody]);

  const slackBody = useMemo(() => {
    if (!legacySlackMessage) {
      return undefined;
    }

    return blockKitToMarkdown(legacySlackMessage);
  }, [legacySlackMessage]);

  const { data: silencer } = useQuery({
    queryKey: ["notification_silence", notification.silenced_by],
    enabled: !!notification.silenced_by,
    queryFn: () => getNotificationSilencesByID(notification.silenced_by!)
  });

  return (
    <div className="flex flex-col gap-3 overflow-auto">
      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-4">
          <VerticalDescription
            label="Resource"
            value={
              <NotificationResourceDisplay
                resource={notification.resource}
                resourceKind={notification.resource_kind}
              />
            }
          />
        </div>

        <VerticalDescription
          label="Age"
          value={
            <span>
              <Age from={notification.created_at} />
              {(notification.count || 1) > 1 && (
                <span className="inline-block pl-1 text-gray-500">
                  (x{notification.count} over{" "}
                  <Age from={notification.first_observed} />)
                </span>
              )}
            </span>
          }
        />

        <VerticalDescription
          label="Recipient"
          value={
            notification.person ? (
              <Avatar user={notification.person} />
            ) : (
              "Unknown"
            )
          }
        />

        {statusConfig && (
          <VerticalDescription
            label="Status"
            value={
              <Status
                status={statusConfig.status}
                statusText={statusConfig.label}
              />
            }
          />
        )}

        {notification.source_event && (
          <VerticalDescription
            label="Event"
            value={notification.source_event}
          />
        )}

        {readableTime && (
          <VerticalDescription label="Duration" value={readableTime} />
        )}

        <VerticalDescription
          label="Notification Rule"
          value={
            <Link
              className="text-blue-500 hover:cursor-pointer hover:underline"
              to={`/notifications/rules?id=${notification.notification_id}`}
            >
              Notification Rule
            </Link>
          }
        />

        {silencer && (
          <VerticalDescription
            label="Silenced By"
            value={
              <Link
                className="text-blue-500 hover:cursor-pointer hover:underline"
                to={`/notifications/silences?id=${notification.silenced_by}`}
              >
                {silencer?.name}
              </Link>
            }
          />
        )}
      </div>

      {(bodyMarkdown || slackBody || legacyBody) && (
        <div className="flex flex-col gap-2">
          <label className="truncate text-sm text-gray-500">Body:</label>
          {bodyMarkdown ? (
            <DisplayMarkdown
              md={bodyMarkdown}
              className="whitespace-pre-wrap break-all rounded bg-black p-4 text-white"
            />
          ) : slackBody ? (
            <DisplayMarkdown
              md={slackBody}
              className="whitespace-pre-wrap break-all rounded bg-black p-4 text-white"
            />
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHTMLContent(legacyBody ?? "")
              }}
            />
          )}
        </div>
      )}

      {error && (
        <div className="relative flex flex-1 flex-col gap-2 overflow-auto">
          <label className="text-sm text-gray-500">Error:</label>
          <div
            className={clsx(
              "flex w-full flex-1 overflow-x-auto overflow-y-auto rounded border border-gray-200 text-sm"
            )}
          >
            <JSONViewer format="json" code={error} convertToYaml />
          </div>
        </div>
      )}
    </div>
  );
}
