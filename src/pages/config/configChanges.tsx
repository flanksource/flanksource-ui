import { useMemo, useState } from "react";
import { useGetAllConfigsChangesQuery } from "../../api/query-hooks";
import { ConfigChangeHistory } from "../../components/ConfigChangeHistory";
import { configTabsLists } from "../../components/ConfigsPage/ConfigTabsLinks";
import { Head } from "../../components/Head/Head";
import { InfoMessage } from "../../components/InfoMessage";
import { SearchLayout } from "../../components/Layout";
import TabbedLinks from "../../components/Tabs/TabbedLinks";
import { BreadcrumbNav, BreadcrumbRoot } from "../../components/BreadcrumbNav";

export function ConfigChangesPage() {
  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 50
  });

  const { data, isLoading, error, isRefetching, refetch } =
    useGetAllConfigsChangesQuery(pageIndex, pageSize, true);
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
        onRefresh={refetch}
        loading={isLoading}
        contentClass="p-0 h-full"
      >
        <div className={`flex flex-col h-full`}>
          <TabbedLinks tabLinks={configTabsLists}>
            <div className="flex flex-col h-full overflow-y-hidden">
              {error ? (
                <InfoMessage message={errorMessage} />
              ) : (
                <ConfigChangeHistory
                  data={data?.data ?? []}
                  isLoading={isLoading}
                  linkConfig
                  pagination={pagination}
                />
              )}
            </div>
          </TabbedLinks>
        </div>
      </SearchLayout>
    </>
  );
}
