import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import qs from "qs";
import clsx from "clsx";
import { FaCog } from "react-icons/fa";
import { BsSortDown, BsSortUp } from "react-icons/bs";

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
import { getSortedTopology } from "../utils/sortTopology";
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

const defaultSortTypes = [
  { id: 1, value: "status", label: "Health" },
  { id: 2, value: "name", label: "Name" },
  { id: 3, value: "type", label: "Type" },
  { id: 4, value: "updated_at", label: "Last Updated" }
];

export function TopologyPage() {
  const { id } = useParams();

  const { loading, setLoading } = useLoader();
  const { topologyState, setTopologyState } = useTopologyPageContext();
  const [searchParams, setSearchParams] = useSearchParams(
    topologyState?.searchParams
  );

  const currentIconRef = useRef();

  const [teams, setTeams] = useState<any>({});

  const [sortTypes, setSortTypes] = useState<typeof defaultSortTypes>([]);
  const [sortBy, setSortBy] = useState(
    Boolean(searchParams.get("sortBy")) ? searchParams.get("sortBy") : "status"
  );
  const [sortByType, setSortByType] = useState(
    Boolean(searchParams.get("sortOrder"))
      ? searchParams.get("sortOrder")
      : "asc"
  );

  const [topologyLabels, setTopologyLabels] = useState([]);
  const [topologyTypes, setTopologyTypes] = useState<any>({});
  const [topologyType, setTopologyType] = useState(
    Boolean(searchParams.get("type")) ? searchParams.get("type") : "All"
  );

  const [currentIcon, setCurrentIcon] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const [size, setSize] = useState(() => getCardWidth());
  const [team, setTeam] = useState(
    Boolean(searchParams.get("team")) ? searchParams.get("team") : "All"
  );
  const [healthStatus, setHealthStatus] = useState(
    Boolean(searchParams.get("status")) ? searchParams.get("status") : "All"
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

    setSortBy(
      Boolean(searchParams.get("sortBy"))
        ? searchParams.get("sortBy")
        : "status"
    );
    setSortByType(
      Boolean(searchParams.get("sortOrder"))
        ? searchParams.get("sortOrder")
        : "asc"
    );
    setHealthStatus(
      Boolean(searchParams.get("status")) ? searchParams.get("status") : "All"
    );
    setTopologyType(
      Boolean(searchParams.get("type")) ? searchParams.get("type") : "All"
    );
    setTeam(
      Boolean(searchParams.get("team")) ? searchParams.get("team") : "All"
    );
  }, [searchParams, id]);

  useEffect(() => {
    setSortValues();
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
      if (currentIconRef.current?.contains(event.target)) {
        return;
      }
      setCurrentIcon("");
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

  const setCardWidth = (width: string) => {
    setSize(`${width}px`);
    localStorage.setItem("topology_card_width", `${width}px`);
  };

  function getCardWidth() {
    let value: any = localStorage.getItem("topology_card_width");

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

  function onSelectSortOption(currentSortBy: string, newSortByType: string) {
    const newSearchParams = {
      ...searchParamsToObj(searchParams),
      sortBy: currentSortBy,
      sortOrder: newSortByType
    };

    setSortBy(currentSortBy);
    setSortByType(newSortByType);

    if (currentSortBy === "status") {
      const { sortBy, sortOrder, ...removedSearchParams } = newSearchParams;
      setSearchParams(removedSearchParams);
    } else {
      setSearchParams(newSearchParams);
    }
    setCurrentIcon("");
  }

  function setSortValues() {
    const currentSortTypes: typeof defaultSortTypes = [];

    topology?.forEach((t) => {
      t?.properties?.forEach((h, index) => {
        if (h.headline && !currentSortTypes.find((t) => t.value === h.name)) {
          currentSortTypes.push({
            id: defaultSortTypes.length + index,
            value: h.name,
            label: h.name
          });
        }
      });
    });

    const newSortTypes = [...defaultSortTypes, ...currentSortTypes];

    if (!newSortTypes.find((t) => sortBy === t.value)?.value) {
      setSortBy("status");
    }

    setSortTypes(newSortTypes);
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
              }
            ].map((v) => (
              <div id={v.id.toString()} className="flex p-3">
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
                  }}
                />
              </div>
            ))}
            {[
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
            ))}
          </div>
          <div
            ref={currentIconRef}
            className="relative flex pt-5 md:self-center md:pt-0"
          >
            <div
              className="mt-1 ml-2 text-gray-700 cursor-pointer md:mt-0 md:items-center md:flex hover:text-gray-900"
              onClick={() =>
                setCurrentIcon((val) => (val === "" ? "sort by" : ""))
              }
            >
              {sortByType === "asc" && <BsSortDown className="w-6 h-6" />}
              {sortByType === "desc" && <BsSortUp className="w-6 h-6" />}
              <span className="hidden ml-2 text-base capitalize bold md:flex">
                {sortTypes.find((s) => s.value === sortBy)?.label}
              </span>
            </div>
            <FaCog
              className="content-center w-6 h-6 ml-4 cursor-pointer"
              onClick={() =>
                setCurrentIcon((val) => (val === "" ? "preferences" : ""))
              }
            />
            <div
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              className={clsx(
                "origin-top-right absolute right-0 mt-10 w-96 z-50 divide-y divide-gray-100 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none capitalize",
                currentIcon === "" ? "hidden" : "display-block",
                currentIcon === "sort by" ? "w-48" : "w-96"
              )}
            >
              <div className="py-1">
                <div className="flex items-center justify-between px-4 py-2 text-base">
                  <span className="font-bold text-gray-700">{currentIcon}</span>
                  <div
                    onClick={() =>
                      onSelectSortOption(
                        sortBy ?? "status",
                        sortByType === "asc" ? "desc" : "asc"
                      )
                    }
                    className={clsx(
                      "mx-1 cursor-pointer text-gray-600 hover:text-gray-900",
                      currentIcon !== "sort by" ? "hidden" : "flex"
                    )}
                  >
                    {sortByType === "asc" && <BsSortDown className="w-5 h-5" />}
                    {sortByType === "desc" && <BsSortUp className="w-5 h-5" />}
                  </div>
                </div>
              </div>
              <div className="py-1" role="none">
                {currentIcon === "preferences" && (
                  <div className="px-4 py-4">
                    <label
                      htmlFor="topology-card-width-slider"
                      className="inline-block mr-3 text-xs text-gray-700"
                    >
                      Card Width:
                    </label>
                    <input
                      step={2}
                      min="250"
                      max="768"
                      type="range"
                      value={parseInt(size, 10)}
                      id="topology-card-width-slider"
                      onChange={(e) => setCardWidth(e.target.value)}
                      className="inline-block w-64 mb-4 rounded-lg cursor-pointer"
                    />
                  </div>
                )}
                {currentIcon === "sort by" && (
                  <div className="flex flex-col">
                    {sortTypes.map((s) => (
                      <span
                        onClick={() =>
                          onSelectSortOption(s.value, sortByType ?? "asc")
                        }
                        className="flex px-4 py-1 text-base cursor-pointer hover:bg-blue-100"
                        style={{
                          fontWeight: sortBy === s.value ? "bold" : "inherit"
                        }}
                      >
                        {s.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex leading-1.21rel w-full mt-4">
          <div className="flex flex-wrap w-full">
            {getSortedTopology(
              topology,
              sortBy ?? "status",
              sortByType ?? "asc"
            ).map((item) => (
              <TopologyCard key={item.id} topology={item} size={size} />
            ))}
          </div>
        </div>
      </>
    </SearchLayout>
  );
}
