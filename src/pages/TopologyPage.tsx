import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  getTopology,
  updateComponentVisibility
} from "../api/services/topology";
import { SearchLayout } from "../components/Layout";
import { ReactSelectDropdown } from "../components/ReactSelectDropdown";
import { schemaResourceTypes } from "../components/SchemaResourcePage/resourceTypes";
import CardsSkeletonLoader from "../components/SkeletonLoader/CardsSkeletonLoader";
import { toastError, toastSuccess } from "../components/Toast/toast";
import { TopologyCard } from "../components/TopologyCard";
import { TopologyPopOver } from "../components/TopologyPopover";
import { getCardWidth } from "../components/TopologyPopover/topologyPreference";
import {
  getSortedTopology,
  getSortLabels
} from "../components/TopologyPopover/topologySort";
import TopologySidebar from "../components/TopologySidebar";

import { getAll } from "../api/schemaResources";
import { ComponentLabelsDropdown } from "../components/Dropdown/ComponentLabelsDropdown";
import { ComponentTypesDropdown } from "../components/Dropdown/ComponentTypesDropdown";
import { InfoMessage } from "../components/InfoMessage";
import { TopologyBreadcrumbs } from "../components/TopologyBreadcrumbs";
import {
  Topology,
  useTopologyPageContext
} from "../context/TopologyPageContext";
import { useLoader } from "../hooks";
import { searchParamsToObj } from "../utils/common";

export const allOption = {
  All: {
    id: "All",
    name: "All",
    description: "All",
    value: "All"
  }
};

export const healthTypes = {
  ...allOption,
  healthy: {
    id: "healthy",
    name: "Healthy",
    description: "Healthy",
    value: "healthy"
  },
  unhealthy: {
    id: "unhealthy",
    name: "Unhealthy",
    description: "Unhealthy",
    value: "unhealthy"
  },
  warning: {
    id: "warning",
    name: "Warning",
    description: "Warning",
    value: "warning"
  }
};

export const saveSortBy = (val: string, sortLabels: any[]) => {
  const sortItem = sortLabels.find((s) => s.value === val);
  if (sortItem?.standard) {
    localStorage.setItem(`topologyCardsSortByStandard`, val);
    localStorage.removeItem(`topologyCardsSortByCustom`);
  } else {
    localStorage.setItem(`topologyCardsSortByCustom`, val);
  }
};

export const saveSortOrder = (val: string) => {
  localStorage.setItem(`topologyCardsSortOrder`, val);
};

export const getSortBy = (sortLabels: any[]) => {
  const val = localStorage.getItem("topologyCardsSortByCustom");
  const sortItem = sortLabels.find((s) => s.value === val);
  if (!sortItem) {
    localStorage.removeItem(`topologyCardsSortByCustom`);
    return localStorage.getItem(`topologyCardsSortByStandard`) || "status";
  }
  return (
    localStorage.getItem("topologyCardsSortByCustom") ||
    localStorage.getItem("topologyCardsSortByStandard") ||
    "status"
  );
};

export const getSortOrder = () => {
  return localStorage.getItem(`topologyCardsSortOrder`) || "asc";
};

export function TopologyPage() {
  const { id } = useParams();

  const { loading, setLoading } = useLoader();
  const { topologyState, setTopologyState } = useTopologyPageContext();
  const [searchParams, setSearchParams] = useSearchParams(
    topologyState?.searchParams
  );

  const [currentTopology, setCurrentTopology] = useState<Topology>();

  const [teams, setTeams] = useState<any>({});
  const [size, setSize] = useState(() => getCardWidth());

  const selectedLabel = searchParams.get("labels") ?? "All";
  const team = searchParams.get("team") ?? "All";
  const topologyType = searchParams.get("type") ?? "All";
  const healthStatus = searchParams.get("status") ?? "All";
  const refererId = searchParams.get("refererId") ?? undefined;

  const topology = topologyState.topology;

  const sortLabels = useMemo(() => {
    if (!topology) {
      return null;
    }
    return getSortLabels(topology);
  }, [topology]);

  useEffect(() => {
    if (!sortLabels) {
      return;
    }
    const sortBy = getSortBy(sortLabels) || "status";
    const sortOrder = localStorage.getItem("topologyCardsSortOrder") || "desc";
    setSearchParams(
      {
        ...Object.fromEntries(searchParams),
        sortBy,
        sortOrder
      },
      {
        // this will replace the history, so that the back button will work as expected
        replace: true
      }
    );
  }, [searchParams, setSearchParams, sortLabels]);

  const load = useCallback(async () => {
    const params = Object.fromEntries(searchParams);

    if (id != null) {
      params.id = id;
    }

    setLoading(true);

    try {
      const apiParams = {
        id,
        status: params.status,
        type: params.type,
        team: params.team,
        labels: params.labels,
        // only flatten, if topology type is set
        ...(params.type &&
          params.type.toString().toLowerCase() !== "all" && {
            flatten: true
          }),
        hidden: params.showHiddenComponents === "no" ? false : undefined
      };
      const res = await getTopology(apiParams);
      if (res.error) {
        toastError(res.error);
        return;
      }

      const currentTopology = res.data[0];
      setCurrentTopology(currentTopology);

      let data;

      if (id) {
        res.data = Array.isArray(res.data) ? res.data : [];
        if (res.data.length > 1) {
          console.warn("Multiple nodes for same id?");
          toastError("Response has multiple components for the id.");
        }
        data = res.data[0]?.components;

        if (!data) {
          console.warn("Component doesn't have any child components.");
          data = res.data;
        }
      } else {
        data = Array.isArray(res.data) ? res.data : [];
      }

      let result = data.filter(
        (item: { name: string; title: string; id: string }) =>
          (item.name || item.title) && item.id !== id
      );

      if (!result.length && data.length) {
        let filtered = data.find((x: Record<string, any>) => x.id === id);
        if (filtered) {
          result = [filtered];
        } else {
          result = [];
        }
      }

      setTopologyState({
        topology: result,
        searchParams
      });
    } catch (ex: any) {
      toastError(ex);
    }

    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, searchParams, setTopologyState]);

  useEffect(() => {
    load();
  }, [searchParams, id, load]);

  useEffect(() => {
    const teamsApiConfig = schemaResourceTypes.find(
      (item) => item.table === "teams"
    );

    getAll(teamsApiConfig)
      .then((res) => {
        const data: any = {
          ...allOption
        };
        res.data.forEach((item: any) => {
          data[item.name] = {
            id: item.name,
            name: item.name,
            description: item.name,
            value: item.name
          };
        });

        setTeams(data);
      })
      .catch((_) => {
        setTeams({
          ...allOption
        });
      });
  }, []);

  const updateVisibility = async (
    topologyId: string | undefined,
    updatedVisibility: boolean
  ) => {
    // don't update if topologyId is not present
    if (!topologyId) {
      return;
    }
    try {
      const { data } = await updateComponentVisibility(
        topologyId,
        updatedVisibility
      );
      if (data) {
        toastSuccess(`Component visibility updated successfully`);
      }
    } catch (ex: any) {
      toastError(ex);
    }
    load();
  };

  if ((loading && !topology) || !topology) {
    return <CardsSkeletonLoader showBreadcrumb />;
  }

  return (
    <SearchLayout
      title={
        <div className="flex text-xl text-gray-400">
          <TopologyBreadcrumbs topologyId={id} refererId={refererId} />
        </div>
      }
      onRefresh={() => {
        load();
      }}
      contentClass="p-0 h-full"
      loading={loading}
    >
      <div className="flex flex-row min-h-full h-auto">
        <div className="flex flex-col flex-1 p-6 min-h-full h-auto">
          <div className="flex">
            <div className="flex flex-wrap">
              <div className="flex p-3">
                <ReactSelectDropdown
                  name="health"
                  label=""
                  value={healthStatus}
                  items={healthTypes}
                  className="inline-block p-3 w-auto max-w-[500px]"
                  dropDownClassNames="w-auto max-w-[400px] left-0"
                  onChange={(val: any) => {
                    setSearchParams({
                      ...Object.fromEntries(searchParams),
                      status: val
                    });
                  }}
                  prefix={
                    <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
                      Health:
                    </div>
                  }
                />
              </div>
              <ComponentTypesDropdown
                className="flex p-3"
                name="Types"
                label=""
                value={topologyType}
                onChange={(val: any) => {
                  setSearchParams({
                    ...Object.fromEntries(searchParams),
                    type: val
                  });
                }}
              />
              <div className="flex p-3">
                <ReactSelectDropdown
                  name="team"
                  label=""
                  value={team}
                  items={teams}
                  className="inline-block p-3 w-auto max-w-[500px]"
                  dropDownClassNames="w-auto max-w-[400px] left-0"
                  onChange={(val: any) => {
                    setSearchParams({
                      ...Object.fromEntries(searchParams),
                      team: val
                    });
                  }}
                  prefix={
                    <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
                      Team:
                    </div>
                  }
                />
              </div>
              <ComponentLabelsDropdown
                name="Labels"
                label=""
                className="flex p-3 w-auto max-w-[500px]"
                value={selectedLabel}
                onChange={(val: any) => {
                  setSearchParams({
                    ...Object.fromEntries(searchParams),
                    labels: val
                  });
                }}
              />
            </div>
            <TopologyPopOver
              size={size}
              setSize={setSize}
              sortLabels={sortLabels || []}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </div>
          <div className="flex leading-1.21rel w-full mt-4">
            <div className="flex flex-wrap w-full">
              {getSortedTopology(
                topology,
                getSortBy(sortLabels || []),
                getSortOrder()
              ).map((item) => (
                <TopologyCard
                  key={item.id}
                  topology={item}
                  size={size}
                  updateVisibility={updateVisibility}
                />
              ))}
              {!topology?.length && (
                <InfoMessage
                  className="my-8"
                  message="There are no components matching this criteria"
                />
              )}
            </div>
          </div>
        </div>
        {id && (
          <TopologySidebar topology={currentTopology} refererId={refererId} />
        )}
      </div>
    </SearchLayout>
  );
}
