import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import qs from "qs";
import clsx from "clsx";
import { FaCog } from "react-icons/fa";

import { Dropdown } from "../components";
import { Loading } from "../components/Loading";
import { SearchLayout } from "../components/Layout";
import { toastError } from "../components/Toast/toast";
import { SearchSelectTag } from "../components/SearchSelectTag";
import { ReactSelectDropdown } from "../components/ReactSelectDropdown";
import { CardSize, CardWidth, TopologyCard } from "../components/TopologyCard";
import { TopologyBreadcrumbs } from "../components/Topology/topology-breadcrumbs";
import { schemaResourceTypes } from "../components/SchemaResourcePage/resourceTypes";

import { useLoader } from "../hooks";
import { getAll } from "../api/schemaResources";
import { searchParamsToObj } from "../utils/common";
import { useTopologyPageContext } from "../context/TopologyPageContext";
import { getTopology, getTopologyComponents } from "../api/services/topology";

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
  const { topologyState, setTopologyState } = useTopologyPageContext();
  const [searchParams, setSearchParams] = useSearchParams(
    topologyState?.searchParams
  );
  const { loading, setLoading } = useLoader();
  const [size, setSize] = useState(() => getCardWidth());
  const [topologyType, setTopologyType] = useState(
    searchParams.get("type") ? searchParams.get("type") : "All"
  );
  const [topologyLabels, setTopologyLabels] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [healthStatus, setHealthStatus] = useState(
    searchParams.get("status") ? searchParams.get("status") : "All"
  );
  const [team, setTeam] = useState(
    searchParams.get("team") ? searchParams.get("team") : "All"
  );
  const [teams, setTeams] = useState<any>({});
  const [topologyTypes, setTopologyTypes] = useState<any>({});
  const [showPreferences, setShowPreferences] = useState(false);
  const preferencesRef = useRef();
  const { id } = useParams();

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
        labels: params.labels
      };

      const res = await getTopology(apiParams);
      if (res.error) {
        toastError(res.error);
        return;
      }

      let data;

      if (id) {
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
        data = res.data;
      }

      let result = data.filter(
        (item) => (item.name || item.title) && item.id !== id
      );

      if (!result.length) {
        result = [data.find((x) => x.id === id)];
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
    data.forEach((component: any) => {
      if (component.type) {
        allTypes[component.type] = {
          id: component.type,
          name: component.type,
          description: component.type,
          value: component.type
        };
      }
    });
    const allLabels = data.flatMap((d: any) => {
      return Object.entries(d?.labels || {});
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
  }, [searchParams, id]);

  useEffect(() => {
    preselectSelectedLabels();
  }, [searchParams, topologyLabels]);

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

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (preferencesRef.current?.contains(event.target)) {
        return;
      }
      setShowPreferences(false);
    };
    document.addEventListener("click", listener);
    return () => {
      document.removeEventListener("click", listener);
    };
  }, []);

  const preselectSelectedLabels = () => {
    let value = searchParams.get("labels") ?? "All";
    if (value === "All") {
      setSelectedLabel(value);
      return;
    }
    const values: string[] = decodeURIComponent(value).split("=");
    const selectedOption = topologyLabels.find((item: any) => {
      return item.toString() === values.toString();
    });
    value = selectedOption?.[0] + "__:__" + selectedOption?.[1];
    setSelectedLabel(value);
  };

  const setCardWidth = (width) => {
    setSize(`${width}px`);
    localStorage.setItem("topology_card_width", `${width}px`);
  };

  function getCardWidth() {
    let value = localStorage.getItem("topology_card_width");
    if (!value?.trim()) {
      return CardWidth[CardSize.extra_large];
    }
    value = parseInt(value, 10);
    if (isNaN(value)) {
      return CardWidth[CardSize.extra_large];
    } else {
      return `${value}px`;
    }
  }

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
      loading={loading}
    >
      <>
        <div className="flex">
          <div className="flex flex-wrap">
            {[
              {
                id: 1,
                name: "Health",
                parentClassName: "flex p-3",
                dropdownClassName: "inline-block w-36",
                items: healthTypes,
                value: healthStatus,
                onChange: (val: any) => setHealthStatus(val)
              },
              {
                id: 2,
                name: "Type",
                parentClassName: "flex p-3",
                dropdownClassName: "inline-block w-48",
                items: topologyTypes,
                value: topologyType,
                onChange: (val: any) => setTopologyType(val)
              },
              {
                id: 3,
                name: "Team",
                parentClassName: "flex p-3",
                dropdownClassName: "inline-block w-48 h-full",
                items: teams,
                value: team,
                onChange: (val: any) => setTeam(val)
              }
            ].map((v) => (
              <div id={v.id.toString()} className={v.parentClassName}>
                <label className="self-center inline-block pt-2 mr-3 text-sm text-gray-500">
                  {`${v.name}:`}
                </label>
                <ReactSelectDropdown
                  label=""
                  value={v.value}
                  items={v.items}
                  className={v.dropdownClassName}
                  onChange={(val: any) => {
                    v.onChange(val);
                    setSearchParams({
                      ...searchParamsToObj(searchParams),
                      status: val
                    });
                  }}
                />
              </div>
            ))}
            {[
              {
                id: 4,
                name: "Labels",
                parentClassName: "flex ml-3",
                searchSelectClassName: "inline-block p-3 w-80",
                tags: topologyLabels,
                value: selectedLabel,
                onChange: (tag: any) => setSelectedLabel(tag)
              }
            ].map((v) => (
              <div id={v.id.toString()} className={v.parentClassName}>
                <label className="self-center inline-block pt-2 mr-3 text-sm text-gray-500">
                  {`${v.name}:`}
                </label>
                <SearchSelectTag
                  value={v.value}
                  tags={v.tags}
                  className={v.searchSelectClassName}
                  onChange={(tag: any) => {
                    v.onChange(tag);
                    setSearchParams({
                      ...searchParamsToObj(searchParams),
                      labels:
                        tag.data.length > 0
                          ? `${encodeURIComponent(
                              tag.data[0]
                            )}=${encodeURIComponent(tag.data[1])}`
                          : "All"
                    });
                  }}
                />
              </div>
            ))}
          </div>
          <div
            className="relative flex self-center inline-block"
            ref={preferencesRef}
          >
            <div>
              <FaCog
                className="content-center w-6 h-6 mt-1 ml-4 cursor-pointer"
                onClick={(e) => {
                  setShowPreferences((val) => !val);
                }}
              />
            </div>
            <div
              className={clsx(
                "origin-top-right absolute right-0 mt-10 w-96 z-50 divide-y divide-gray-100 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none",
                showPreferences ? "display-block" : "hidden"
              )}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <div className="py-1">
                <div className="flex items-center px-4 py-2 text-base font-bold text-gray-700 group">
                  Preferences
                </div>
              </div>
              <div className="py-1" role="none">
                <div className="px-4 py-4">
                  <label
                    htmlFor="topology-card-width-slider"
                    className="inline-block mr-3 text-xs text-gray-700"
                  >
                    Card Width:
                  </label>
                  <input
                    id="topology-card-width-slider"
                    type="range"
                    min="250"
                    max="768"
                    step={2}
                    value={parseInt(size, 10)}
                    onChange={(e) => setCardWidth(e.target.value)}
                    className="inline-block w-64 mb-4 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex leading-1.21rel w-full mt-4">
          <div className="flex flex-wrap w-full">
            {topology.map((item) => (
              <TopologyCard key={item.id} topology={item} size={size} />
            ))}
          </div>
        </div>
      </>
    </SearchLayout>
  );
}
