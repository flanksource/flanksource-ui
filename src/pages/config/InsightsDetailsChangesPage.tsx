import { useParams, useSearchParams } from "react-router-dom";
import { InfoMessage } from "../../components/InfoMessage";
import { SearchLayout } from "../../components/Layout";
import ConfigSidebar from "../../components/ConfigSidebar";
import { ConfigsDetailsBreadcrumbNav } from "../../components/BreadcrumbNav/ConfigsDetailsBreadCrumb";
import {
  useGetConfigByIdQuery,
  useGetConfigInsights
} from "../../api/query-hooks";
import { Head } from "../../components/Head/Head";
import TabbedLinks from "../../components/Tabs/TabbedLinks";
import { useConfigDetailsTabs } from "../../components/ConfigsPage/ConfigTabsLinks";
import { ConfigTypeInsights } from "../../components/ConfigInsights";
import InsightsDataTable from "../../components/InsightsDataTable";

export function InsightsDetailsChangesPage() {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();

  const { data: configInsights = [], isLoading } = useGetConfigInsights<
    ConfigTypeInsights[]
  >(id ?? "");

  const { data: configItem, error: itemError } = useGetConfigByIdQuery(id!);

  const configTabList = useConfigDetailsTabs();

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
        loading={isLoading}
        contentClass="p-0 h-full overflow-y-auto"
      >
        <div className={`flex flex-row min-h-full h-auto`}>
          <TabbedLinks tabLinks={configTabList}>
            <div
              className={`flex flex-col flex-1 p-6 pb-0 min-h-full h-auto overflow-auto`}
            >
              <div
                className="flex flex-col items-start overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 8.5rem)" }}
              >
                <InsightsDataTable
                  data={configInsights}
                  isLoading={isLoading}
                  params={params}
                  setParams={setParams}
                />
              </div>
            </div>
          </TabbedLinks>
          <ConfigSidebar />
        </div>
      </SearchLayout>
    </>
  );
}
