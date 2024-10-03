import NotificationSilenceForm from "@flanksource-ui/components/Notifications/SilenceNotificationForm/NotificationSilenceForm";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { useNavigate } from "react-router-dom";

export default function NotificationSilencedAddPage() {
  const navigate = useNavigate();

  return (
    <>
      <Head prefix="Silence Notification" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot link="/notifications" key="breadcrumb">
                Notifications
              </BreadcrumbRoot>,
              <BreadcrumbChild link="/notifications/silences" key={"silence"}>
                Silences
              </BreadcrumbChild>,
              <BreadcrumbChild key={"add"}>Add</BreadcrumbChild>
            ]}
          />
        }
        contentClass="p-0 h-full"
      >
        <div className="mx-auto flex h-full max-w-screen-md flex-1 flex-col px-6 py-6 pb-0">
          <h3 className="text-xl font-semibold">Silence Notification</h3>
          <NotificationSilenceForm
            onSuccess={() => navigate("/notifications/silences")}
          />
        </div>
      </SearchLayout>
    </>
  );
}
