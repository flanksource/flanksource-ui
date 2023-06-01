import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getAll } from "../api/schemaResources";
import { getTopology } from "../api/services/topology";
import { ComponentLabelsDropdown } from "../components/Dropdown/ComponentLabelsDropdown";
import { ComponentTypesDropdown } from "../components/Dropdown/ComponentTypesDropdown";
import { Head } from "../components/Head/Head";
import { InfoMessage } from "../components/InfoMessage";
import { SearchLayout } from "../components/Layout";
import { ReactSelectDropdown } from "../components/ReactSelectDropdown";
import { schemaResourceTypes } from "../components/SchemaResourcePage/resourceTypes";
import CardsSkeletonLoader from "../components/SkeletonLoader/CardsSkeletonLoader";
import { toastError } from "../components/Toast/toast";
import { TopologyBreadcrumbs } from "../components/TopologyBreadcrumbs";
import { TopologyCard } from "../components/TopologyCard";
import { TopologyPopOver } from "../components/TopologyPopover";
import { getCardWidth } from "../components/TopologyPopover/topologyPreference";
import {
  getSortLabels,
  getSortedTopology
} from "../components/TopologyPopover/topologySort";
import TopologySidebar from "../components/TopologySidebar/TopologySidebar";
import {
  Topology,
  useTopologyPageContext
} from "../context/TopologyPageContext";
import { useLoader } from "../hooks";
import { refreshButtonClickedTrigger } from "../components/SlidingSideBar";
import { AgentNamesDropdown } from "../components/Agents/AgentNamesDropdown";

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

  const [, setTriggerRefresh] = useAtom(refreshButtonClickedTrigger);

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
  const agentId = searchParams.get("agent_id") ?? "All";
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

  const load = useCallback(async () => {
    const params = Object.fromEntries(searchParams);

    if (id != null) {
      params.id = id;
    }

    setLoading(true);

    let currentTopology, topology;

    try {
      const apiParams = {
        id,
        status: params.status,
        type: params.type,
        team: params.team,
        agent_id: params.agent_id,
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

      currentTopology = res.data[0];

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

      topology = data.filter(
        (item: { name: string; title: string; id: string }) =>
          (item.name || item.title) && item.id !== id
      );

      if (!topology.length && data.length) {
        let filtered = data.find((x: Record<string, any>) => x.id === id);
        if (filtered) {
          topology = [filtered];
        } else {
          topology = [];
        }
      }
      setLoading(false);
    } catch (ex: any) {
      toastError(ex);
      setLoading(false);
      return;
    }

    setTopologyState({
      topology,
      searchParams
    });

    setCurrentTopology(currentTopology);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, searchParams, setTopologyState]);

  const onRefresh = useCallback(() => {
    load();
    setTriggerRefresh((prev) => prev + 1);
  }, [load, setTriggerRefresh]);

  useEffect(() => {
    load();
  }, [searchParams, id, load]);

  useEffect(() => {
    if (!sortLabels) {
      return;
    }

    const sortByFromURL = searchParams.get("sortBy");
    const sortOrderFromURL = searchParams.get("sortOrder");

    const sortByFromLocalStorage = getSortBy(sortLabels) || "status";
    const sortOrderFromLocalStorage =
      localStorage.getItem("topologyCardsSortOrder") || "desc";

    if (!sortByFromURL && !sortOrderFromURL) {
      searchParams.set("sortBy", sortByFromLocalStorage);
      searchParams.set("sortOrder", sortOrderFromLocalStorage);
    }

    // this will replace the history, so that the back button will work as expected
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams, sortLabels]);

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

  if ((loading && !topology) || !topology) {
    return <CardsSkeletonLoader showBreadcrumb />;
  }

  return (
    <>
      <Head prefix="Topology" />
      <SearchLayout
        title={<TopologyBreadcrumbs topologyId={id} refererId={refererId} />}
        onRefresh={onRefresh}
        contentClass="p-0 h-full"
        loading={loading}
      >
        <div className="flex flex-row h-full py-2 overflow-y-auto">
          <div className="flex flex-col flex-1 h-full overflow-y-auto">
            <div className="flex px-6">
              <div className="flex flex-wrap">
                <div className="flex p-3 pl-0">
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
                <div className="flex p-3">
                  <AgentNamesDropdown
                    name="agent_id"
                    value={agentId}
                    className="inline-block p-3 w-auto max-w-[500px]"
                    dropDownClassNames="w-auto max-w-[400px] left-0"
                    onChange={(val: any) => {
                      setSearchParams({
                        ...Object.fromEntries(searchParams),
                        agent_id: val
                      });
                    }}
                  />
                </div>
              </div>
              <TopologyPopOver
                size={size}
                setSize={setSize}
                sortLabels={sortLabels || []}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
              />
            </div>
            <div className="px-6 py-4 flex leading-1.21rel w-full">
              <div className="flex flex-wrap w-full">
                {getSortedTopology(
                  topology,
                  getSortBy(sortLabels || []),
                  getSortOrder()
                ).map((item) => (
                  <TopologyCard
                    key={item.id + item.updated_at}
                    topology={item}
                    size={size}
                    isTopologyPage
                    onRefresh={load}
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
            <TopologySidebar
              topology={currentTopology}
              refererId={refererId}
              onRefresh={load}
            />
          )}
        </div>
      </SearchLayout>
    </>
  );
}
