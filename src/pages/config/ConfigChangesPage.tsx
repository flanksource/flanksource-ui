import { useGetAllConfigsChangesQuery } from "@flanksource-ui/api/query-hooks/useConfigChangesHooks";
import { ConfigChangeTable } from "@flanksource-ui/components/Configs/Changes/ConfigChangeTable";
import { ConfigChangeFilters } from "@flanksource-ui/components/Configs/Changes/ConfigChangesFilters/ConfigChangesFilters";
import ConfigPageTabs from "@flanksource-ui/components/Configs/ConfigPageTabs";
import { InfoMessage } from "@flanksource-ui/components/InfoMessage";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { PaginationOptions } from "@flanksource-ui/ui/DataTable";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { refreshButtonClickedTrigger } from "@flanksource-ui/ui/SlidingSideBar/SlidingSideBar";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export function ConfigChangesPage() {
  const [, setRefreshButtonClickedTrigger] = useAtom(
    refreshButtonClickedTrigger
  );
  const [params, setParams] = useSearchParams({
    sortBy: "created_at",
    sortDirection: "desc"
  });

  const page = params.get("page") ?? "1";
  const pageSize = params.get("pageSize") ?? "200";

  const { data, isLoading, error, isRefetching, refetch } =
    useGetAllConfigsChangesQuery({
      keepPreviousData: true
    });

  const changes = (data?.changes ?? []).map((changes) => ({
    ...changes,
    config: {
      id: changes.config_id!,
      type: changes.type!,
      name: changes.name!
    }
  }));

  const totalChanges = data?.total ?? 0;
  const totalChangesPages = Math.ceil(totalChanges / parseInt(pageSize));

  const pagination = useMemo(() => {
    const pagination: PaginationOptions = {
      setPagination: (updater) => {
        const newParams =
          typeof updater === "function"
            ? updater({
                pageIndex: parseInt(page) - 1,
                pageSize: parseInt(pageSize)
              })
            : updater;
        params.set("page", (newParams.pageIndex + 1).toString());
        params.set("pageSize", newParams.pageSize.toString());
        setParams(params);
      },
      pageIndex: parseInt(page) - 1,
      pageSize: parseInt(pageSize),
      pageCount: totalChangesPages,
      remote: true,
      enable: true,
      loading: isLoading
    };
    return pagination;
  }, [page, pageSize, totalChangesPages, isLoading, params, setParams]);

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
              <BreadcrumbRoot link="/catalog" key="config-catalog-changes-root">
                Catalog
              </BreadcrumbRoot>,
              <BreadcrumbChild
                link="/catalog/changes"
                key="config-catalog-changes"
              >
                Changes
              </BreadcrumbChild>
            ]}
          />
        }
        onRefresh={() => {
          setRefreshButtonClickedTrigger((prev) => prev + 1);
          refetch();
        }}
        loading={isLoading || isRefetching}
        contentClass="p-0 h-full"
      >
        <ConfigPageTabs activeTab="Changes">
          {error ? (
            <InfoMessage message={errorMessage} />
          ) : (
            <>
              <ConfigChangeFilters paramsToReset={["page"]} />
              <ConfigChangeTable
                data={changes}
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
