import NotificationTabsLinks from "@flanksource-ui/components/Notifications/NotificationTabsLinks";
import NotificationSilenceForm from "@flanksource-ui/components/Notifications/SilenceNotificationForm/NotificationSilenceForm";
import { useNavigate } from "react-router-dom";

export default function NotificationSilencedAddPage() {
  const navigate = useNavigate();

  return (
    <NotificationTabsLinks activeTab={"Silences"} isAddSilence>
      <div className="mx-auto flex h-full max-w-screen-md flex-1 flex-col px-6 py-6 pb-0">
        <h3 className="px-4 text-xl font-semibold">Silence Notification</h3>
        <NotificationSilenceForm
          onSuccess={() => navigate("/notifications/silences")}
        />
      </div>
    </NotificationTabsLinks>
  );
}
