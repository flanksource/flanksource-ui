import NotificationTabsLinks from "@flanksource-ui/components/Notifications/NotificationTabsLinks";
import NotificationSilenceDirectForm from "@flanksource-ui/components/Notifications/SilenceNotificationForm/NotificationSilenceDirectForm";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function NotificationSilencedAddPage() {
  const navigate = useNavigate();
  const client = useQueryClient();

  return (
    <NotificationTabsLinks activeTab={"Silences"} isAddSilence>
      <div className="mx-auto flex h-full max-w-screen-md flex-1 flex-col px-6 py-6 pb-0">
        <h3 className="px-4 text-xl font-semibold">Silence Notification</h3>
        <NotificationSilenceDirectForm
          onSuccess={() => {
            navigate("/notifications/silences");
            client.invalidateQueries({
              queryKey: ["notification_silences"]
            });

            client.refetchQueries({
              queryKey: ["notification_silences"]
            });
          }}
        />
      </div>
    </NotificationTabsLinks>
  );
}
