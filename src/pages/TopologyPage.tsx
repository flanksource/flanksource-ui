import qs from "qs";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getTopology, getTopologyComponents } from "../api/services/topology";
import { SearchLayout } from "../components/Layout";
import { Loading } from "../components/Loading";
import { toastError } from "../components/Toast/toast";
import { CardSize, CardWidth, TopologyCard } from "../components/TopologyCard";
import { TopologyBreadcrumbs } from "../components/Topology/topology-breadcrumbs";
import { useLoader } from "../hooks";
import { useTopologyPageContext } from "../context/TopologyPageContext";
import { Dropdown } from "../components";
import { SearchSelectTag } from "../components/SearchSelectTag";
import { BiCog } from "react-icons/bi";
import clsx from "clsx";
import { searchParamsToObj } from "../utils/common";
import { getAll } from "../api/schemaResources";
import { schemaResourceTypes } from "../components/SchemaResourcePage/resourceTypes";

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
        <div className="flex text-xl text-gray-400  ">
          <TopologyBreadcrumbs topologyId={id} />
        </div>
      }
      onRefresh={load}
      loading={loading}
    >
      <>
        <div className="flex">
          <div className="flex flex-1">
            <div className="flex">
              <label className="inline-block mr-3 text-gray-500 text-sm pt-2">
                Health:
              </label>
              <Dropdown
                items={healthTypes}
                onChange={(val: any) => {
                  setHealthStatus(val);
                  setSearchParams({
                    ...searchParamsToObj(searchParams),
                    status: val
                  });
                }}
                label=""
                className="w-36 inline-block"
                value={healthStatus}
              />
            </div>
            <div className="flex ml-3">
              <label className="inline-block mr-3 text-gray-500 text-sm pt-2">
                Type:
              </label>
              <Dropdown
                items={topologyTypes}
                onChange={(val: any) => {
                  setTopologyType(val);
                  setSearchParams({
                    ...searchParamsToObj(searchParams),
                    type: val
                  });
                }}
                label=""
                className="w-48 inline-block"
                value={topologyType}
              />
            </div>
            <div className="flex ml-3">
              <label className="inline-block mr-3 text-gray-500 text-sm pt-2">
                Team:
              </label>
              <Dropdown
                items={teams}
                onChange={(val: any) => {
                  setTeam(val);
                  setSearchParams({
                    ...searchParamsToObj(searchParams),
                    team: val
                  });
                }}
                label=""
                className="w-48 inline-block"
                value={team}
              />
            </div>
            <div className="flex ml-3">
              {Boolean(topologyLabels.length) && (
                <>
                  <label className="inline-block mr-3 text-gray-500 text-sm pt-2">
                    Labels:
                  </label>
                  <SearchSelectTag
                    className="w-80 inline-block"
                    tags={topologyLabels}
                    value={selectedLabel}
                    onChange={(tag: any) => {
                      setSelectedLabel(tag);
                      console.log(tag);
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
                </>
              )}
            </div>
            <div className="relative inline-block flex" ref={preferencesRef}>
              <div>
                <BiCog
                  className="content-center cursor-pointer ml-4 mt-1 h-6 w-6"
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
                  <div className="text-gray-700 group flex items-center px-4 py-2 text-base font-bold">
                    Preferences
                  </div>
                </div>
                <div className="py-1" role="none">
                  <div className="px-4 py-4">
                    <label
                      htmlFor="topology-card-width-slider"
                      className="inline-block mr-3 text-gray-700 text-xs"
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
                      className="w-64 rounded-lg cursor-pointer mb-4 inline-block"
                    />
                  </div>
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
