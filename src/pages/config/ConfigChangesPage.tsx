import { useGetAllConfigsChangesQuery } from "@flanksource-ui/api/query-hooks/useConfigChangesHooks";
import { useGetConfigChangesById } from "@flanksource-ui/api/query-hooks/useGetConfigChangesByConfigChangeIdQuery";
import { ConfigChange } from "@flanksource-ui/api/types/configs";
import { ConfigChangeTable } from "@flanksource-ui/components/Configs/Changes/ConfigChangeTable";
import { ConfigChangeFilters } from "@flanksource-ui/components/Configs/Changes/ConfigChangesFilters/ConfigChangesFilters";
import ConfigChangesSwimlane from "@flanksource-ui/components/Configs/Changes/ConfigChangesSwimlane";
import { useConfigChangesViewToggleState } from "@flanksource-ui/components/Configs/Changes/ConfigChangesViewToggle";
import { ConfigDetailChangeModal } from "@flanksource-ui/components/Configs/Changes/ConfigDetailsChanges/ConfigDetailsChanges";
import ConfigPageTabs from "@flanksource-ui/components/Configs/ConfigPageTabs";
import ConfigsTypeIcon from "@flanksource-ui/components/Configs/ConfigsTypeIcon";
import { InfoMessage } from "@flanksource-ui/components/InfoMessage";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { refreshButtonClickedTrigger } from "@flanksource-ui/ui/SlidingSideBar/SlidingSideBar";
import { useAtom } from "jotai";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export function ConfigChangesPage() {
  const [, setRefreshButtonClickedTrigger] = useAtom(
    refreshButtonClickedTrigger
  );
  const view = useConfigChangesViewToggleState();
  const [selectedChange, setSelectedChange] = useState<ConfigChange>();
  const { data: changeDetails, isLoading: changeLoading } =
    useGetConfigChangesById(selectedChange?.id ?? "", {
      enabled: !!selectedChange
    });
  const [params] = useSearchParams({});

  const configTypes = params.get("configTypes") ?? undefined;
  const configType =
    // we want to show breadcrumb only if there is only one config type selected
    // in the filter dropdown and not multiple
    configTypes?.split(",").length === 1
      ? configTypes.split(",")[0]?.split(":")?.[0].split("__").join("::")
      : undefined;

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
      name: changes.name!,
      deleted_at: changes.deleted_at
    }
  }));

  const totalChanges = data?.total ?? 0;
  const totalChangesPages = Math.ceil(totalChanges / parseInt(pageSize));

  const errorMessage =
    typeof error === "string"
      ? error
      : ((error as Record<string, string>)?.message ?? "Something went wrong");

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
              </BreadcrumbChild>,
              ...(configType
                ? [
                    <BreadcrumbChild
                      link={`/catalog?configType=${configType}`}
                      key={configType}
                    >
                      <ConfigsTypeIcon
                        config={{ type: configType }}
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
        loading={isLoading || isRefetching}
        contentClass="p-0 h-full flex flex-col flex-1"
      >
        <ConfigPageTabs activeTab="Changes" configType={configType}>
          {error ? (
            <InfoMessage message={errorMessage} />
          ) : (
            <>
              <ConfigChangeFilters paramsToReset={["page"]} />
              {view === "Graph" ? (
                <>
                  <ConfigChangesSwimlane
                    changes={changes}
                    onItemClicked={(change) => setSelectedChange(change)}
                  />
                  {selectedChange && (
                    <ConfigDetailChangeModal
                      isLoading={changeLoading}
                      open={!!selectedChange}
                      setOpen={(open) => {
                        if (!open) setSelectedChange(undefined);
                      }}
                      changeDetails={changeDetails ?? selectedChange}
                    />
                  )}
                </>
              ) : (
                <ConfigChangeTable
                  data={changes}
                  isLoading={isLoading}
                  isRefetching={isRefetching}
                  totalRecords={totalChanges}
                  numberOfPages={totalChangesPages}
                />
              )}
            </>
          )}
        </ConfigPageTabs>
      </SearchLayout>
    </>
  );
}
