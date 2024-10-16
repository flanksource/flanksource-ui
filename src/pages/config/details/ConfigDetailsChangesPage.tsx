import { useGetConfigChangesByIDQuery } from "@flanksource-ui/api/query-hooks/useConfigChangesHooks";
import { ConfigChangeTable } from "@flanksource-ui/components/Configs/Changes/ConfigChangeTable";
import { ConfigRelatedChangesFilters } from "@flanksource-ui/components/Configs/Changes/ConfigsRelatedChanges/FilterBar/ConfigRelatedChangesFilters";
import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import { InfoMessage } from "@flanksource-ui/components/InfoMessage";
import { PaginationOptions } from "@flanksource-ui/ui/DataTable";
import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";

export function ConfigDetailsChangesPage() {
  const { id } = useParams();
  const [params, setParams] = useSearchParams({
    sortBy: "created_at",
    sortDirection: "desc"
  });
  const page = params.get("page") ?? "1";
  const pageSize = params.get("pageSize") ?? "200";

  const { data, isLoading, error, refetch } = useGetConfigChangesByIDQuery({
    keepPreviousData: true,
    enabled: !!id
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

  if (error) {
    const errorMessage =
      typeof error === "symbol"
        ? error
        : ((error as any)?.message ?? "Something went wrong");

    return <InfoMessage message={errorMessage} />;
  }

  return (
    <ConfigDetailsTabs
      pageTitlePrefix={"Catalog Changes"}
      isLoading={isLoading}
      refetch={refetch}
      activeTabName="Changes"
    >
      <div className={`flex h-full flex-1 flex-col overflow-y-auto`}>
        <div className="flex w-full flex-1 flex-col items-start gap-2 overflow-y-auto">
          <ConfigRelatedChangesFilters paramsToReset={["page"]} />
          <div className="flex w-full flex-1 flex-col overflow-y-auto">
            <ConfigChangeTable
              data={changes}
              isLoading={isLoading}
              numberOfPages={totalChangesPages}
              totalRecords={totalChanges}
            />
          </div>
        </div>
      </div>
    </ConfigDetailsTabs>
  );
}
