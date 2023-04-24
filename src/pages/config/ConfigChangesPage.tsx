import { useMemo, useState } from "react";
import { useGetAllConfigsChangesQuery } from "../../api/query-hooks";
import { ConfigChangeHistory } from "../../components/ConfigChangeHistory";
import { configTabsLists } from "../../components/ConfigsPage/ConfigTabsLinks";
import { Head } from "../../components/Head/Head";
import { InfoMessage } from "../../components/InfoMessage";
import { SearchLayout } from "../../components/Layout";
import TabbedLinks from "../../components/Tabs/TabbedLinks";
import { BreadcrumbNav, BreadcrumbRoot } from "../../components/BreadcrumbNav";
import { useAtom } from "jotai";
import { refreshButtonClickedTrigger } from "../../components/SlidingSideBar";
import { ConfigChangeFilters } from "../../components/ConfigChangesFilters/ConfigChangesFilters";
import { useSearchParams } from "react-router-dom";

export function ConfigChangesPage() {
  const [, setRefreshButtonClickedTrigger] = useAtom(
    refreshButtonClickedTrigger
  );

  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 50
  });
  const [params] = useSearchParams();
  const type = params.get("type") ?? undefined;
  const change_type = params.get("change_type") ?? undefined;
  const severity = params.get("severity") ?? undefined;
  const { data, isLoading, error, isRefetching, refetch } =
    useGetAllConfigsChangesQuery(
      { type, change_type, severity },
      pageIndex,
      pageSize,
      true
    );
  const totalEntries = (data as any)?.totalEntries;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  const pagination = useMemo(() => {
    return {
      setPagination: setPageState,
      pageIndex,
      pageSize,
      pageCount,
      remote: true,
      enable: true,
      loading: isLoading || isRefetching
    };
  }, [pageIndex, pageSize, pageCount, isLoading, isRefetching]);

  const errorMessage =
    typeof error === "string"
      ? error
      : (error as Record<string, string>)?.message ?? "Something went wrong";

  return (
    <>
      <Head prefix="Config Changes" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot link="/configs/changes">
                Config Changes
              </BreadcrumbRoot>
            ]}
          />
        }
        onRefresh={() => {
          setRefreshButtonClickedTrigger((prev) => prev + 1);
          refetch();
        }}
        loading={isLoading}
        contentClass="p-0 h-full"
      >
        <div className={`flex flex-col h-full`}>
          <TabbedLinks tabLinks={configTabsLists}>
            <div className="flex flex-col h-full overflow-y-hidden">
              {error ? (
                <InfoMessage message={errorMessage} />
              ) : (
                <>
                  <ConfigChangeFilters />
                  <ConfigChangeHistory
                    data={data?.data ?? []}
                    isLoading={isLoading}
                    linkConfig
                    pagination={pagination}
                  />
                </>
              )}
            </div>
          </TabbedLinks>
        </div>
      </SearchLayout>
    </>
  );
}
