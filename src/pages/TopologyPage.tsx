import { useEffect, useMemo, useState } from "react";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { useParams, useSearchParams } from "react-router-dom";
import { getTopology, getTopologyComponent } from "../api/services/topology";
import { SearchLayout } from "../components/Layout";
import { ReactSelectDropdown } from "../components/ReactSelectDropdown";
import { schemaResourceTypes } from "../components/SchemaResourcePage/resourceTypes";
import CardsSkeletonLoader from "../components/SkeletonLoader/CardsSkeletonLoader";
import { toastError } from "../components/Toast/toast";
import { TopologyCard } from "../components/TopologyCard";
import { TopologyPopOver } from "../components/TopologyPopover";
import { getCardWidth } from "../components/TopologyPopover/topologyPreference";
import {
  getSortedTopology,
  getSortLabels
} from "../components/TopologyPopover/topologySort";
import TopologySidebar from "../components/TopologySidebar";

import { useLoader } from "../hooks";
import { getAll } from "../api/schemaResources";
import { searchParamsToObj } from "../utils/common";
import {
  Topology,
  useTopologyPageContext
} from "../context/TopologyPageContext";
import { TopologyBreadcrumbs } from "../components/TopologyBreadcrumbs";
import { ComponentTypesDropdown } from "../components/Dropdown/ComponentTypesDropdown";
import { ComponentLabelsDropdown } from "../components/Dropdown/ComponentLabelsDropdown";

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
  const [selectedLabel, setSelectedLabel] = useState("");
  const [size, setSize] = useState(() => getCardWidth());
  const [team, setTeam] = useState(searchParams.get("team") ?? "All");
  const [topologyType, setTopologyType] = useState(
    searchParams.get("type") ?? "All"
  );
  const [healthStatus, setHealthStatus] = useState(
    searchParams.get("status") ?? "All"
  );
  const refererId = searchParams.get("refererId");
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
    setSearchParams({
      ...searchParamsToObj(searchParams),
      sortBy,
      sortOrder
    });
  }, [sortLabels]);

  const load = async () => {
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
          params.type.toString().toLowerCase() !== "all" && { flatten: true })
      };
      // @ts-ignore
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
    } catch (ex) {
      toastError(ex);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
    setHealthStatus(searchParams.get("status") ?? "All");
    setTopologyType(searchParams.get("type") ?? "All");
    setTeam(searchParams.get("team") ?? "All");
    setSelectedLabel(searchParams.get("labels") ?? "All");
  }, [searchParams, id]);

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
      .catch((err) => {
        setTeams({
          ...allOption
        });
      });
  }, []);

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
                <label className="self-center inline-block pt-2 mr-3 text-sm text-gray-500">
                  Health
                </label>
                <ReactSelectDropdown
                  name="helath"
                  label=""
                  value={healthStatus}
                  items={healthTypes}
                  className="inline-block p-3 w-80 md:w-60"
                  onChange={(val: any) => {
                    setHealthStatus(val);
                    setSearchParams({
                      ...searchParamsToObj(searchParams),
                      status: val
                    });
                  }}
                />
              </div>
              <ComponentTypesDropdown
                className="flex p-3"
                name="Types"
                label=""
                value={topologyType}
                onChange={(val: any) => {
                  setTopologyType(val);
                  setSearchParams({
                    ...searchParamsToObj(searchParams),
                    type: val
                  });
                }}
              />
              <div className="flex p-3">
                <label className="self-center inline-block pt-2 mr-3 text-sm text-gray-500">
                  Team
                </label>
                <ReactSelectDropdown
                  name="team"
                  label=""
                  value={team}
                  items={teams}
                  className="inline-block p-3 w-80 md:w-60"
                  onChange={(val: any) => {
                    setTeam(val);
                    setSearchParams({
                      ...searchParamsToObj(searchParams),
                      team: val
                    });
                  }}
                />
              </div>
              <ComponentLabelsDropdown
                name="Labels"
                label=""
                className="flex p-3"
                value={selectedLabel}
                onChange={(val: any) => {
                  setSelectedLabel(val);
                  setSearchParams({
                    ...searchParamsToObj(searchParams),
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
                <TopologyCard key={item.id} topology={item} size={size} />
              ))}
              {!topology?.length && (
                <div className="w-full flex justify-center">
                  <div className="w-96 mt-16">
                    <div className="rounded-md bg-gray-100 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <BsFillInfoCircleFill />
                        </div>
                        <div className="ml-3 flex-1 md:flex md:justify-between">
                          <p className="text-sm">
                            There are no components matching this criteria
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
