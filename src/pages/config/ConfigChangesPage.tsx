import { useGetAllConfigsChangesQuery } from "@flanksource-ui/api/query-hooks";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/components/BreadcrumbNav";
import { ConfigChangeHistory } from "@flanksource-ui/components/Configs/Changes/ConfigChangeHistory";
import { ConfigChangeFilters } from "@flanksource-ui/components/Configs/Changes/ConfigChangesFilters/ConfigChangesFilters";
import ConfigPageTabs from "@flanksource-ui/components/Configs/ConfigPageTabs";
import ConfigsTypeIcon from "@flanksource-ui/components/Configs/ConfigsTypeIcon";
import { Head } from "@flanksource-ui/components/Head/Head";
import { InfoMessage } from "@flanksource-ui/components/InfoMessage";
import { SearchLayout } from "@flanksource-ui/components/Layout";
import { refreshButtonClickedTrigger } from "@flanksource-ui/components/SlidingSideBar";
import useTimeRangeParams from "@flanksource-ui/ui/TimeRangePicker/useTimeRangeParams";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function ConfigChangesPage() {
  const { timeRangeAbsoluteValue } = useTimeRangeParams();
  const [, setRefreshButtonClickedTrigger] = useAtom(
    refreshButtonClickedTrigger
  );
  const itemsPerPage = 50;
  const [pageState, setPageState] = useState({
    pageIndex: 0,
    pageSize: itemsPerPage
  });
  const [params, setParams] = useSearchParams();
  const config_type = params.get("configType") ?? undefined;
  const change_type = params.get("change_type") ?? undefined;
  const severity = params.get("severity") ?? undefined;
  const starts_at = timeRangeAbsoluteValue?.from ?? undefined;
  const ends_at = timeRangeAbsoluteValue?.to ?? undefined;
  const pageSize = +(params.get("pageSize") ?? itemsPerPage);
  const pageIndex = +(params.get("pageIndex") ?? 0);
  const page = pageIndex === 0 ? 0 : pageIndex - 1;
  const { data, isLoading, error, isRefetching, refetch } =
    useGetAllConfigsChangesQuery(
      { config_type, change_type, severity, starts_at, ends_at },
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
  }, [change_type, severity]);

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
              <BreadcrumbRoot
                link="/catalog/changes"
                key="config-catalog-changes-root"
              >
                Catalog Changes
              </BreadcrumbRoot>,
              ...(config_type
                ? [
                    <BreadcrumbChild
                      link={`/catalog?type=${config_type}`}
                      key={config_type}
                    >
                      <ConfigsTypeIcon
                        config={{ type: config_type }}
                        showSecondaryIcon
                        showLabel
                      />
                    </BreadcrumbChild>
                  ]
                : [])
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
        <ConfigPageTabs activeTab="Changes">
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
        </ConfigPageTabs>
      </SearchLayout>
    </>
  );
}
