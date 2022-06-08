import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getTopology } from "../../api/services/topology";
import { Icon } from "../Icon";
import { Loading } from "../Loading";
import { useLoader } from "../../hooks";

export function TopologyBreadcrumbs({ clusterId, groupId, podOrNodeId }) {
  const [cluster, setCluster] = useState();
  const [group, setGroup] = useState();
  const [podOrNode, setPodOrNode] = useState();
  const { loading, setLoading } = useLoader();

  async function loadClusterDetails() {
    if (!clusterId) {
      return;
    }
    setLoading(true);
    try {
      const results = await getTopology({ id: clusterId });
      const value = results.data.find((item) => item.id === clusterId);
      setCluster(value);
    } catch (ex) {
      setCluster(null);
    }
    setLoading(false);
  }

  async function loadGroupDetails() {
    if (!groupId) {
      return;
    }
    setLoading(true);
    try {
      const results = await getTopology({ id: groupId });
      const value = results.data.find((item) => item.id === groupId);
      setGroup(value);
    } catch (ex) {
      setGroup(null);
    }
    setLoading(false);
  }

  async function loadPodOrNodeDetails() {
    if (!podOrNodeId) {
      return;
    }
    setLoading(true);
    try {
      const results = await getTopology({ id: podOrNodeId });
      const value = results.data.find((item) => item.id === podOrNodeId);
      setPodOrNode(value);
    } catch (ex) {
      setPodOrNode(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadClusterDetails();
  }, [clusterId]);

  useEffect(() => {
    loadGroupDetails();
  }, [groupId]);

  useEffect(() => {
    loadPodOrNodeDetails();
  }, [podOrNodeId]);

  if (loading) {
    return <Loading text=".." />;
  }

  return (
    <>
      <Link to="/topology" className="hover:text-gray-500 ">
        Topology
      </Link>
      {cluster && (
        <>
          &nbsp;/&nbsp;
          <Link
            to={`/topology/${cluster.id}`}
            className="flex flex-nowrap hover:text-gray-500 my-auto "
          >
            <Icon name={cluster.icon} size="xl" className="mr-1" />
            {cluster.name || cluster.title}
          </Link>
        </>
      )}
      {group && (
        <>
          &nbsp;/&nbsp;
          <Link
            to={`/topology/${cluster.id}/${group.id}`}
            className="flex flex-nowrap hover:text-gray-500 my-auto "
          >
            <Icon name={group.icon} size="xl" className="mr-1" />
            {group.name || group.title}
          </Link>
        </>
      )}
      {podOrNode && (
        <>
          &nbsp;/&nbsp;
          <Link
            to={`/topology/${cluster.id}/${group.id}/${podOrNode.id}`}
            className="flex flex-nowrap hover:text-gray-500 my-auto "
          >
            <Icon name={podOrNode.icon} size="xl" className="mr-1" />
            {podOrNode.name || podOrNode.title}
          </Link>
        </>
      )}
    </>
  );
}
