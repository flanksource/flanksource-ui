import { NotificationSendHistoryApiResponse } from "@flanksource-ui/api/types/notifications";
import { Age } from "@flanksource-ui/ui/Age";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";
import VerticalDescription from "@flanksource-ui/ui/description/VerticalDescription";
import { formatDuration } from "@flanksource-ui/utils/date";
import clsx from "clsx";
import { useMemo } from "react";
import NotificationResourceDisplay from "../NotificationResourceDisplay";
import { notificationSendHistoryStatus } from "../NotificationsStatusCell";

type NotificationDetailsProps = {
  notification: NotificationSendHistoryApiResponse;
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

  return (
    <div className="flex flex-col gap-3 overflow-auto">
      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-4">
          <VerticalDescription
            label="Resource"
            value={<NotificationResourceDisplay notification={notification} />}
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
              <div className="flex items-center space-x-2">
                {statusConfig.Icon}
                <span>{statusConfig.label}</span>
              </div>
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
      </div>

      {notification.body && (
        <div className="flex flex-col gap-2">
          <label className="truncate text-sm text-gray-500">Body:</label>
          <div
            dangerouslySetInnerHTML={{
              __html: notification.body
            }}
          ></div>
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
