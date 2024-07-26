import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import {
  useCreateNotification,
  useNotificationsSummaryQuery
} from "../../api/query-hooks/useNotificationsQuery";
import { BreadcrumbNav, BreadcrumbRoot } from "../../ui/BreadcrumbNav";
import { Head } from "../../ui/Head";
import { SearchLayout } from "../../ui/Layout/SearchLayout";
import { Modal } from "../../ui/Modal";
import { AuthorizationAccessCheck } from "../Permissions/AuthorizationAccessCheck";
import NotificationsForm from "./NotificationsForm";
import NotificationsTable from "./NotificationsTable";
import { Notification } from "./notificationsTableColumns";

export default function NotificationsPage() {
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, refetch, isRefetching } =
    useNotificationsSummaryQuery({
      keepPreviousData: true
    });

  const { mutate: createNotification } = useCreateNotification(() => {
    refetch();
    setIsOpen(false);
  });

  const onSubmit = (notification: Partial<Notification>) => {
    createNotification(notification);
  };

  const notifications = data?.data;

  return (
    <>
      <Head prefix="Notifications" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key="notifications" link="/settings/jobs">
                Notifications
              </BreadcrumbRoot>,
              <AuthorizationAccessCheck
                resource={tables.notifications}
                action="write"
                key="add-notifications"
              >
                <button
                  key="notifications-add"
                  type="button"
                  className=""
                  onClick={() => setIsOpen(true)}
                >
                  <AiFillPlusCircle size={32} className="text-blue-600" />
                </button>
              </AuthorizationAccessCheck>
            ]}
          />
        }
        onRefresh={refetch}
        contentClass="p-0 h-full"
        loading={isLoading || isRefetching}
      >
        <div className="flex h-full w-full flex-1 flex-col p-6 pb-0">
          <NotificationsTable
            notifications={notifications ?? []}
            isLoading={isLoading || isRefetching}
            refresh={refetch}
          />
        </div>
      </SearchLayout>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Notification"
        bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
      >
        <NotificationsForm onSubmit={onSubmit} onDeleted={refetch} />
      </Modal>
    </>
  );
}
