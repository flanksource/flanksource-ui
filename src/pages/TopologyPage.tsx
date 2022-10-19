import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import qs from "qs";

import { Loading } from "../components/Loading";
import { SearchLayout } from "../components/Layout";
import { toastError } from "../components/Toast/toast";
import { TopologyCard } from "../components/TopologyCard";
import { TopologyPopOver } from "../components/TopologyPopover";
import { ReactSelectDropdown } from "../components/ReactSelectDropdown";
import { TopologyBreadcrumbs } from "../components/Topology/topologyBreadcrumbs";
import { schemaResourceTypes } from "../components/SchemaResourcePage/resourceTypes";

import { useLoader } from "../hooks";
import { getAll } from "../api/schemaResources";
import { searchParamsToObj } from "../utils/common";
import {
  Topology,
  useTopologyPageContext
} from "../context/TopologyPageContext";
import { getTopology, getTopologyComponents } from "../api/services/topology";
import { getSortedTopology } from "../components/TopologyPopover/topologySort";
import { getCardWidth } from "../components/TopologyPopover/topologyPreference";
import TopologySidebar from "../components/TopologySidebar";
import { BsFillInfoCircleFill } from "react-icons/bs";

const allOption = {
  All: {
    id: "All",
    name: "All",
    description: "All",
    value: "All"
  }
};

const healthTypes = {
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
  const [topologyLabels, setTopologyLabels] = useState<any>({});
  const [team, setTeam] = useState(searchParams.get("team") ?? "All");
  const [topologyTypes, setTopologyTypes] = useState<any>({});
  const [topologyType, setTopologyType] = useState(
    searchParams.get("type") ?? "All"
  );
  const [healthStatus, setHealthStatus] = useState(
    searchParams.get("status") ?? "All"
  );

  const topology = topologyState.topology;

  const load = async () => {
    const params = qs.parse(searchParams.toString());

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
        result = [data.find((x: Record<string, any>) => x.id === id)];
      }

      setTopologyState({
        topology: result,
        searchParams
      });
    } catch (ex) {
      if (typeof ex === "string") {
        toastError(ex);
      }
    }

    setLoading(false);
  };

  async function fetchComponents() {
    const { data } = await getTopologyComponents();

    if (!data) {
      return;
    }

    const allTypes: { [key: string]: any } = {};
    const allLabels: { [key: string]: any } = {
      ...allOption
    };
    data.forEach((component: any) => {
      if (component.type) {
        allTypes[component.type] = {
          id: component.type,
          name: component.type,
          description: component.type,
          value: component.type
        };
      }
      const entries = Object.entries(component?.labels || {});
      if (entries.length) {
        entries.forEach((entry) => {
          if (!entry.length) {
            return;
          }
          const value = `${entry[0]}=${entry[1]}`;
          const label = `${entry[0]}:${entry[1]}`;
          allLabels[value] = {
            id: value,
            name: label,
            description: label,
            value: value
          };
        });
      }
    });
    setTopologyLabels(allLabels);
    setTopologyTypes({ ...allOption, ...allTypes });
  }

  useEffect(() => {
    load();
    fetchComponents();

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
    return <Loading text="Loading topology..." />;
  }

  return (
    <SearchLayout
      title={
        <div className="flex text-xl text-gray-400">
          <TopologyBreadcrumbs topologyId={id} />
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
              {[
                {
                  id: 1,
                  name: "Health",
                  dropdownClassName: "inline-block p-3 w-80 md:w-36",
                  items: healthTypes,
                  value: healthStatus,
                  onChange: (val: any) => {
                    setHealthStatus(val);
                    setSearchParams({
                      ...searchParamsToObj(searchParams),
                      status: val
                    });
                  }
                },
                {
                  id: 2,
                  name: "Type",
                  dropdownClassName: "inline-block p-3 w-80 md:w-48",
                  items: topologyTypes,
                  value: topologyType,
                  onChange: (val: any) => {
                    setTopologyType(val);
                    setSearchParams({
                      ...searchParamsToObj(searchParams),
                      type: val
                    });
                  }
                },
                {
                  id: 3,
                  name: "Team",
                  dropdownClassName: "inline-block p-3 w-80 md:w-48",
                  items: teams,
                  value: team,
                  onChange: (val: any) => {
                    setTeam(val);
                    setSearchParams({
                      ...searchParamsToObj(searchParams),
                      team: val
                    });
                  }
                },
                {
                  id: 3,
                  name: "Team",
                  dropdownClassName: "inline-block p-3 w-80 md:w-48",
                  items: teams,
                  value: team,
                  onChange: (val: any) => {
                    setTeam(val);
                    setSearchParams({
                      ...searchParamsToObj(searchParams),
                      team: val
                    });
                  }
                },
                {
                  id: 4,
                  name: "Labels",
                  dropdownClassName: "inline-block p-3 w-80 md:w-60",
                  items: topologyLabels,
                  value: selectedLabel,
                  onChange: (tag: any) => {
                    setSelectedLabel(tag);
                    setSearchParams({
                      ...searchParamsToObj(searchParams),
                      labels: tag
                    });
                  }
                }
              ].map((v) => (
                <div id={v.id.toString()} className="flex p-3">
                  <label className="self-center inline-block pt-2 mr-3 text-sm text-gray-500">
                    {`${v.name}:`}
                  </label>
                  <ReactSelectDropdown
                    label=""
                    // @ts-expect-error
                    value={v.value}
                    items={v.items}
                    className={v.dropdownClassName}
                    // @ts-expect-error
                    onChange={(val: any) => {
                      v.onChange(val);
                    }}
                  />
                </div>
              ))}
              {/* {[
              {
                id: 4,
                name: "Labels",
                searchTagClassName: "inline-block p-3 w-80 md:w-60",
                tags: topologyLabels,
                value: selectedLabel,
                onChange: (tag: any) => {
                  setSelectedLabel(tag);
                  setSearchParams({
                    ...searchParamsToObj(searchParams),
                    labels:
                      tag.data.length > 0
                        ? `${encodeURIComponent(
                            tag.data[0]
                          )}=${encodeURIComponent(tag.data[1])}`
                        : "All"
                  });
                }
              }
            ].map((v) => (
              <div id={v.id.toString()} className="flex ml-3">
                <label className="self-center inline-block pt-2 mr-3 text-sm text-gray-500">
                  {`${v.name}:`}
                </label>
                <SearchSelectTag
                  value={v.value}
                  tags={v.tags}
                  className={v.searchTagClassName}
                  onChange={(tag: any) => {
                    v.onChange(tag);
                  }}
                />
              </div>
            ))} */}
            </div>

            <TopologyPopOver
              size={size}
              setSize={setSize}
              topology={topology}
              searchParams={searchParams}
              topologyLabels={topologyLabels}
              setSearchParams={setSearchParams}
            />
          </div>
          <div className="flex leading-1.21rel w-full mt-4">
            <div className="flex flex-wrap w-full">
              {getSortedTopology(
                topology,
                searchParams.get("sortBy") ?? "status",
                searchParams.get("sortOrder") ?? "desc"
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
        {id && <TopologySidebar topology={currentTopology} />}
      </div>
    </SearchLayout>
  );
}
