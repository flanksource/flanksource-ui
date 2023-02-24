import { useParams } from "react-router-dom";
import { ConfigChangeHistory } from "../../components/ConfigChangeHistory";
import { InfoMessage } from "../../components/InfoMessage";
import { SearchLayout } from "../../components/Layout";
import ConfigSidebar from "../../components/ConfigSidebar";
import { ConfigsPageTabs } from "../../components/ConfigsPage/ConfigsPageTabs";
import { ConfigsDetailsBreadcrumbNav } from "../../components/BreadcrumbNav/ConfigsDetailsBreadCrumb";
import {
  useGetConfigChangesQueryById,
  useGetConfigByIdQuery
} from "../../api/query-hooks";
import { Head } from "../../components/Head/Head";

export function ConfigDetailsChangesPage() {
  const { id } = useParams();

  const {
    data: historyData,
    isLoading,
    error,
    refetch
  } = useGetConfigChangesQueryById(id!);

  const {
    data: configItem,
    isLoading: itemLoading,
    error: itemError
  } = useGetConfigByIdQuery(id!);

  if (error) {
    const errorMessage =
      typeof error === "symbol"
        ? error
        : error?.message ?? "Something went wrong";

    return <InfoMessage message={errorMessage} />;
  }

  if (itemError) {
    const errorMessage =
      typeof itemError === "symbol"
        ? itemError
        : itemError?.message ?? "Something went wrong";

    return <InfoMessage message={errorMessage} />;
  }

  return (
    <>
      <Head prefix={configItem ? `Config Changes - ${configItem.name}` : ""} />
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
            <div
              className="flex flex-col items-start overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 8.5rem)" }}
            >
              <ConfigChangeHistory
                data={historyData ?? []}
                isLoading={isLoading}
              />
            </div>
          </div>
          <ConfigSidebar />
        </div>
      </SearchLayout>
    </>
  );
}
