import { filter } from "lodash";
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
  const [size, setSize] = useState(CardWidth[CardSize.extra_large]);

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
      if (id) {
        apiParams.depth = 0;
      }

      const res = await getTopology(apiParams);
      if (res.error) {
        toastError(res.error);
        return;
      }
      let topology = filter(
        res.data,
        (item) =>
          (item.name || item.title) && item.type !== "summary" && item.id !== id
      );
      if (!topology.length) {
        topology = [res.data.find((x) => x.id === id)];
      }

      setTopology(topology);
    } catch (ex) {
      toastError(ex);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [searchParams, id]);

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
        <label
          htmlFor="topology-card-width-slider"
          className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Topology Card Width (250px to 768px): {size}
        </label>
        <input
          id="topology-card-width-slider"
          type="range"
          min="250"
          max="768"
          step={2}
          value={parseInt(size, 10)}
          onChange={(e) => setSize(`${e.target.value}px`)}
          className="w-64 h-2 bg-gray-200 rounded-lg cursor-pointer dark:bg-gray-700 mb-10"
        />
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
