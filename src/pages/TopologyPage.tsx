import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getTopology } from "../api/services/topology";
import { ComponentLabelsDropdown } from "../components/Dropdown/ComponentLabelsDropdown";
import { ComponentTypesDropdown } from "../components/Dropdown/ComponentTypesDropdown";
import { Head } from "../components/Head/Head";
import { InfoMessage } from "../components/InfoMessage";
import { SearchLayout } from "../components/Layout";
import {
  ReactSelectDropdown,
  StateOption
} from "../components/ReactSelectDropdown";
import CardsSkeletonLoader from "../components/SkeletonLoader/CardsSkeletonLoader";
import { TopologyBreadcrumbs } from "../components/TopologyBreadcrumbs";
import { TopologyCard } from "../components/TopologyCard";
import { TopologyPopOver } from "../components/TopologyPopover";
import { getCardWidth } from "../components/TopologyPopover/topologyPreference";
import {
  getSortLabels,
  getSortedTopology
} from "../components/TopologyPopover/topologySort";
import TopologySidebar from "../components/TopologySidebar/TopologySidebar";
import { refreshButtonClickedTrigger } from "../components/SlidingSideBar";
import { useQuery } from "@tanstack/react-query";
import {
  Topology,
  useTopologyPageContext
} from "../context/TopologyPageContext";
import { AgentNamesDropdown } from "../components/Agents/AgentNamesDropdown";
import { toastError } from "../components/Toast/toast";

export const allOption = {
  All: {
    id: "All",
    name: "All",
    description: "All",
    value: "All"
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

  const [searchParams, setSearchParams] = useSearchParams();
  const { setTopologyState } = useTopologyPageContext();
  const [size, setSize] = useState(() => getCardWidth());

  const selectedLabel = searchParams.get("labels") ?? "All";
  const team = searchParams.get("team") ?? "All";
  const agentId = searchParams.get("agent_id") ?? "All";
  const topologyType = searchParams.get("type") ?? "All";
  const healthStatus = searchParams.get("status") ?? "All";
  const refererId = searchParams.get("refererId") ?? undefined;
  const showHiddenComponents =
    searchParams.get("showHiddenComponents") ?? undefined;

  const { data, isLoading, refetch } = useQuery(
    [
      "topologies",
      id,
      healthStatus,
      team,
      selectedLabel,
      topologyType,
      showHiddenComponents
    ],
    () => {
      const apiParams = {
        id,
        status: healthStatus,
        type: topologyType,
        team: team,
        labels: selectedLabel,
        // only flatten, if topology type is set
        ...(topologyType &&
          topologyType.toString().toLowerCase() !== "all" && {
            flatten: true
          }),
        hidden: showHiddenComponents === "no" ? false : undefined
      };
      return getTopology(apiParams);
    }
  );

  const currentTopology = useMemo(() => data?.components?.[0], [data]);

  const topology = useMemo(() => {
    let topologyData: Topology[] | undefined;

    if (id) {
      const x = Array.isArray(data?.components) ? data?.components : [];

      if (x!.length > 1) {
        console.warn("Multiple nodes for same id?");
        toastError("Response has multiple components for the id.");
      }

      topologyData = x![0]?.components;

      if (!topologyData) {
        console.warn("Component doesn't have any child components.");
        topologyData = data?.components;
      }
    } else {
      topologyData = data?.components ?? [];
    }

    let components = topologyData?.filter(
      (item) => (item.name || item.title) && item.id !== id
    );

    if (!components?.length && topologyData?.length) {
      let filtered = topologyData?.find(
        (x: Record<string, any>) => x.id === id
      );
      if (filtered) {
        components = [filtered];
      } else {
        components = [];
      }
    }

    setTopologyState({
      topology: components,
      searchParams
    });
    return components;
  }, [data?.components, id, searchParams, setTopologyState]);

  // todo: add team and inspect the shape of the data
  const teams = useMemo(() => {
    const teamOptions =
      data?.teams
        ?.filter((team) => team)
        .map((team) => ({
          id: team,
          name: team,
          description: team,
          value: team
        })) ?? [];
    return [allOption["All"], ...teamOptions];
  }, [data]);

  const topologyTypes = useMemo(() => {
    const typeOptions =
      data?.types
        ?.filter((type) => type)
        .map((type) => ({
          id: type,
          name: type,
          description: type,
          value: type
        })) ?? [];
    return [allOption["All"], ...typeOptions];
  }, [data?.types]);

  const healthStatuses = useMemo(() => {
    const statusOptions: StateOption[] =
      data?.healthStatuses?.map((status) => ({
        id: status,
        value: status,
        label: status
      })) ?? [];
    return [allOption["All"], ...statusOptions];
  }, [data?.healthStatuses]);

  const sortLabels = useMemo(() => {
    if (!topology) {
      return null;
    }
    return getSortLabels(topology);
  }, [topology]);

  const onRefresh = useCallback(() => {
    refetch();
    setTriggerRefresh((prev) => prev + 1);
  }, [refetch, setTriggerRefresh]);

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

  return (
    <>
      <Head prefix="Topology" />
      <SearchLayout
        title={<TopologyBreadcrumbs topologyId={id} refererId={refererId} />}
        onRefresh={onRefresh}
        contentClass="p-0 h-full"
        loading={isLoading}
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
                    items={healthStatuses}
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
                  topologyTypes={topologyTypes}
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
            {isLoading && !topology?.length ? (
              <CardsSkeletonLoader />
            ) : (
              <div className="px-6 py-4 flex leading-1.21rel w-full">
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
                      isTopologyPage
                    />
                  ))}
                  {!topology?.length && !isLoading && (
                    <InfoMessage
                      className="my-8"
                      message="There are no components matching this criteria"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          {id && (
            <TopologySidebar
              topology={currentTopology}
              refererId={refererId}
              onRefresh={refetch}
            />
          )}
        </div>
      </SearchLayout>
    </>
  );
}
