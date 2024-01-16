import { useEffect, useMemo, useState } from "react";
import { useGetAllConfigsChangesQuery } from "../../api/query-hooks";
import { ConfigChangeHistory } from "../../components/Configs/Changes/ConfigChangeHistory";
import { configTabsLists } from "../../components/Configs/ConfigTabsLinks";
import { Head } from "../../components/Head/Head";
import { InfoMessage } from "../../components/InfoMessage";
import { SearchLayout } from "../../components/Layout";
import TabbedLinks from "../../components/Tabs/TabbedLinks";
import { BreadcrumbNav, BreadcrumbRoot } from "../../components/BreadcrumbNav";
import { useAtom } from "jotai";
import { refreshButtonClickedTrigger } from "../../components/SlidingSideBar";
import { ConfigChangeFilters } from "../../components/Configs/Changes/ConfigChangesFilters/ConfigChangesFilters";
import { useSearchParams } from "react-router-dom";

export function ConfigChangesPage() {
  const [, setRefreshButtonClickedTrigger] = useAtom(
    refreshButtonClickedTrigger
  );
  const itemsPerPage = 50;
  const [pageState, setPageState] = useState({
    pageIndex: 0,
    pageSize: itemsPerPage
  });
  const [params, setParams] = useSearchParams();
  const type = params.get("type") ?? undefined;
  const change_type = params.get("change_type") ?? undefined;
  const severity = params.get("severity") ?? undefined;
  const pageSize = +(params.get("pageSize") ?? itemsPerPage);
  const pageIndex = +(params.get("pageIndex") ?? 0);
  const page = pageIndex === 0 ? 0 : pageIndex - 1;
  const { data, isLoading, error, isRefetching, refetch } =
    useGetAllConfigsChangesQuery(
      { type, change_type, severity },
      page,
      pageSize,
      true
    );
  const totalEntries = (data as any)?.totalEntries;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  const pagination = useMemo(() => {
    return {
      setPagination: setPageState,
      pageIndex: page,
      pageSize,
      pageCount,
      remote: true,
      enable: true,
      loading: isLoading || isRefetching
    };
  }, [pageSize, pageCount, isLoading, isRefetching, page]);

  useEffect(() => {
    setParams({
      ...Object.fromEntries(params),
      pageIndex: ((pageState.pageIndex || 0) + 1).toString(),
      pageSize: (pageState.pageSize || itemsPerPage).toString()
    });
  }, [pageState, params, setParams]);

  useEffect(() => {
    setPageState({
      pageIndex: 0,
      pageSize: itemsPerPage
    });
  }, [change_type, severity, type]);

  const errorMessage =
    typeof error === "string"
      ? error
      : (error as Record<string, string>)?.message ?? "Something went wrong";

  return (
    <>
      <Head prefix="Catalog Changes" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot link="/catalog/changes">
                Catalog Changes
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
            <div className="flex flex-col gap-4 h-full overflow-y-hidden">
              {error ? (
                <InfoMessage message={errorMessage} />
              ) : (
                <>
                  <ConfigChangeFilters
                    paramsToReset={{
                      pageIndex: "1",
                      pageSize: itemsPerPage.toString()
                    }}
                  />
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
