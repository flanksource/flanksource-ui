import { filter } from "lodash";
import qs from "qs";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getTopology } from "../api/services/topology";
import { SearchLayout } from "../components/Layout";
import { Loading } from "../components/Loading";
import { toastError } from "../components/Toast/toast";
import { TopologyCard } from "../components/Topology";
import { TopologyBreadcrumbs } from "../components/Topology/topology-breadcrumbs";
import { Dropdown } from "../components/Dropdown";
import { useLoader } from "../hooks";

const healthItems = {
  all: {
    id: "all",
    label: "All",
    description: "All",
    value: "all"
  },
  unhealthy: {
    id: "unhealthy",
    label: "Unhealthy",
    description: "Unhealthy",
    value: "unhealthy"
  },
  healthy: {
    id: "healthy",
    label: "Healthy",
    description: "Healthy",
    value: "healthy"
  }
};

export function TopologyPage() {
  const { loading, setLoading } = useLoader();
  const [topology, setTopology] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const { clusterId, groupId, podOrNodeId } = useParams();
  const load = async () => {
    const params = qs.parse(searchParams.toString());
    if (clusterId != null) {
      params.id = clusterId;
    }
    setLoading(true);
    try {
      const res = await getTopology({
        id: podOrNodeId || groupId || clusterId,
        status: params.status
      });
      if (res.error) {
        toastError(res.error);
        return;
      }
      const topology = filter(
        res.data,
        (item) => (item.name || item.title) && item.type !== "summary"
      );
      setTopology(topology);
    } catch (ex) {
      toastError(ex);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [clusterId, searchParams, groupId, podOrNodeId]);

  function onHealthCriteriaChange(val) {
    setSearchParams(
      val && val !== "all"
        ? {
            status: val
          }
        : {}
    );
  }

  if (loading || topology == null) {
    return <Loading text="Loading topology..." />;
  }

  return (
    <SearchLayout
      title={
        <div className="flex text-xl text-gray-400  ">
          <TopologyBreadcrumbs
            clusterId={clusterId}
            groupId={groupId}
            podOrNodeId={podOrNodeId}
          />
        </div>
      }
      extra={
        groupId && !podOrNodeId ? (
          <div className="flex items-center mr-4">
            <div className="mr-3 text-gray-500 text-sm">Severity</div>
            <Dropdown
              name="severity"
              className="w-36 mr-2 flex-shrink-0"
              items={healthItems}
              value={searchParams.get("status") || "all"}
              onChange={onHealthCriteriaChange}
            />
          </div>
        ) : undefined
      }
      onRefresh={load}
    >
      <div className="flex leading-1.21rel">
        <div className="flex flex-wrap">
          {topology.map((item) => (
            <TopologyCard key={item.id} topology={item} size="extra-large" />
          ))}
        </div>
      </div>
    </SearchLayout>
  );
}
