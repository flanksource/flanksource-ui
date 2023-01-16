import { useParams } from "react-router-dom";
import { ConfigChangeHistory } from "../../components/ConfigChangeHistory";
import { InfoMessage } from "../../components/InfoMessage";
import { SearchLayout } from "../../components/Layout";
import { ConfigsDetailsBreadcrumbNav } from "../../components/BreadcrumbNav/ConfigsDetailsBreadCrumb";
import { useGetConfigChangesQueryById } from "../../api/query-hooks";
import ConfigSidebar from "../../components/ConfigSidebar";
import { ConfigsPageTabs } from "../../components/ConfigsPage/ConfigsPageTabs";

export function ConfigDetailsChangesPage() {
  const { id } = useParams();

  const {
    data: historyData,
    isLoading,
    error,
    refetch
  } = useGetConfigChangesQueryById(id!);

  if (error) {
    const errorMessage =
      typeof error === "symbol"
        ? error
        : error?.message ?? "Something went wrong";

    return <InfoMessage message={errorMessage} />;
  }

  return (
    <SearchLayout
      title={
        <div className="flex space-x-2">
          <span className="text-lg">
            <ConfigsDetailsBreadcrumbNav configId={id} />
          </span>
        </div>
      }
      onRefresh={refetch}
      loading={isLoading}
      contentClass="p-0 h-full"
    >
      <div className={`flex flex-row min-h-full h-auto`}>
        <div
          className={`flex flex-col flex-1 p-6 pb-0 min-h-full h-auto overflow-auto`}
        >
          <ConfigsPageTabs basePath={`configs/${id}`} />
          <div className="flex flex-col items-start">
            <ConfigChangeHistory
              data={historyData ?? []}
              isLoading={isLoading}
            />
          </div>
        </div>
        <ConfigSidebar />
      </div>
    </SearchLayout>
  );
}
