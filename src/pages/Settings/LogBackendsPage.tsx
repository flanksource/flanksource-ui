import { useState } from "react";
import { Head } from "../../components/Head/Head";
import { SearchLayout } from "../../components/Layout";
import TableSkeletonLoader from "../../components/SkeletonLoader/TableSkeletonLoader";
import { BreadcrumbNav, BreadcrumbRoot } from "../../components/BreadcrumbNav";
import { AiFillPlusCircle } from "react-icons/ai";
import { useQuery } from "@tanstack/react-query";
import { getLogsBackends } from "../../api/schemaResources";
import LogBackendsList from "../../components/LogBackends/LogBackendsList";
import ErrorPage from "../../components/Errors/ErrorPage";
import { LogBackends } from "../../components/LogBackends/LogBackends";
import { Modal } from "../../components/Modal";
import LogBackendsForm from "../../components/LogBackends/LogBackendsForm";

export function LogBackendsPage() {
  const [isOpen, setIsOpen] = useState(false);

  const { isLoading, data, refetch, error } = useQuery<LogBackends[], Error>(
    ["settings", "logging_backends", "all"],
    async () => getLogsBackends(),
    {
      cacheTime: 0,
      staleTime: 0
    }
  );

  return (
    <>
      <Head prefix="Log Backends" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot link="/settings/">
                Logging Backends
              </BreadcrumbRoot>,
              <button
                type="button"
                className=""
                onClick={() => setIsOpen(true)}
              >
                <AiFillPlusCircle size={32} className="text-blue-600" />
              </button>
            ]}
          />
        }
        onRefresh={refetch}
        contentClass="p-0 h-full"
        loading={isLoading}
      >
        <div className="flex flex-col flex-1 px-6 pb-0 h-full max-w-screen-xl mx-auto">
          <LogBackendsList
            className="mt-6 overflow-y-hidden"
            data={data || []}
            isLoading={isLoading}
            onUpdated={refetch}
          />
          {error && !data && !isLoading && <ErrorPage error={error} />}
        </div>
        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          title="Edit Logging Backend"
          bodyClass="flex flex-col flex-1 overflow-y-auto"
          size="full"
        >
          <LogBackendsForm
            onUpdated={() => {
              setIsOpen(false);
              refetch();
            }}
          />
        </Modal>
      </SearchLayout>
    </>
  );
}
