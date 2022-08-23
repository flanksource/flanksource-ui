import qs from "qs";
import { useEffect, useState } from "react";
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

const allOption = {
  All: {
    id: "All",
    name: "All",
    description: "All",
    value: "All"
  }
};

export function TopologyPage() {
  const { loading, setLoading } = useLoader();
  const { topologyState, setTopologyState } = useTopologyPageContext();
  const [size, setSize] = useState(() => getCardWidth());
  const [topologyType, setTopologyType] = useState("All");
  const [owner, setOwner] = useState("All");
  const [owners, setOwners] = useState<any>({});
  const [topologyTypes, setTopologyTypes] = useState<any>({});
  const topology = topologyState.topology;

  const [searchParams, setSearchParams] = useSearchParams(
    topologyState?.searchParams
  );
  const { id } = useParams();
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
        owner: params.owner
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
    const allOwners: { [key: string]: any } = {};
    data.forEach((component: any) => {
      if (component.type) {
        allTypes[component.type] = {
          id: component.type,
          name: component.type,
          description: component.type,
          value: component.type
        };
      }
      if (component.owner) {
        allTypes[component.owner] = {
          id: component.owner,
          name: component.owner,
          description: component.owner,
          value: component.owner
        };
      }
    });
    setTopologyTypes({ ...allOption, ...allTypes });
    setOwners({ ...allOption, ...allOwners });
  }

  useEffect(() => {
    load();
    fetchComponents();
  }, [searchParams, id]);

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
            <label
              htmlFor="topology-card-width-slider"
              className="inline-block mr-3 text-gray-500 text-sm"
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
              className="w-64 rounded-lg cursor-pointer mb-10 inline-block"
            />
          </div>
          <div className="flex flex-1 justify-end">
            <div className="flex-1">
              <label className="inline-block mr-3 text-gray-500 text-sm">
                Type:
              </label>
              <Dropdown
                items={topologyTypes}
                onChange={(val: any) => {
                  setTopologyType(val);
                  setSearchParams({
                    ...searchParams,
                    type: val
                  });
                }}
                label=""
                className="w-64 inline-block"
                value={topologyType}
              />
            </div>
            <div className="flex-1">
              <label className="inline-block mr-3 text-gray-500 text-sm">
                Owner:
              </label>
              <Dropdown
                items={owners}
                onChange={(val: any) => {
                  setOwner(val);
                  setSearchParams({
                    ...searchParams,
                    owner: val
                  });
                }}
                label=""
                className="w-64 inline-block"
                value={owner}
              />
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
