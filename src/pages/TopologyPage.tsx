import qs from "qs";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getTopology } from "../api/services/topology";
import { SearchLayout } from "../components/Layout";
import { Loading } from "../components/Loading";
import { toastError } from "../components/Toast/toast";
import { CardSize, CardWidth, TopologyCard } from "../components/TopologyCard";
import { TopologyBreadcrumbs } from "../components/Topology/topology-breadcrumbs";
import { useLoader } from "../hooks";

export function TopologyPage() {
  const { loading, setLoading } = useLoader();
  const [topology, setTopology] = useState(null);
  const [size, setSize] = useState(() => getCardWidth());

  const [searchParams, setSearchParams] = useSearchParams();
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
        status: params.status
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

      let topology = data.filter(
        (item) => (item.name || item.title) && item.id !== id
      );

      if (!topology.length) {
        topology = [data.find((x) => x.id === id)];
      }

      setTopology(topology);
    } catch (ex) {
      if (typeof ex === "string") {
        toastError(ex);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
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

  if (loading || topology == null) {
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
    >
      <>
        {Boolean(topology?.length) && (
          <>
            <label
              htmlFor="topology-card-width-slider"
              className="inline-block font-medium mb-1 text-xs linear-1.21rel mr-1 cursor-pointer text-gray-900 dark:text-gray-300"
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
              className="w-64 h-1.5 rounded-lg cursor-pointer mb-10 inline-block"
            />
          </>
        )}
        <div className="flex leading-1.21rel w-full">
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
