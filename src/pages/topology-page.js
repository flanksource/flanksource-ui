import { filter } from "lodash";
import qs from "qs";
import { React, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getTopology } from "../api/services/topology";
import { SearchLayout } from "../components/Layout";
import { Loading } from "../components/Loading";
import { toastError } from "../components/Toast/toast";
import { TopologyCard } from "../components/Topology";
import { TopologyBreadcrumbs } from "../components/Topology/topology-breadcrumbs";

export function TopologyPage() {
  // const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [topology, setTopology] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [root, setRoot] = useState(null);
  const { id } = useParams();
  const load = () => {
    setIsLoading(true);
    const params = qs.parse(searchParams.toString());
    if (id != null) {
      params.id = id;
    }
    getTopology(params)
      .then((res) => {
        setIsLoading(false);

        if (res == null) {
          return null;
        }

        if (res.error != null) {
          toastError(res.error);
          return null;
        }

        const topology = filter(
          res.data,
          (i) => i.name != null || i.title != null
        );
        setTopology(topology);
        return null;
      })
      .catch((e) => {
        setIsLoading(false);
        if (e.response && e.response.data.error) {
          toastError(e.response.data.error);
        } else {
          toastError(e);
        }
      });
  };
  useEffect(() => {
    if (topology != null) {
      setRoot(topology.find((i) => i.id === id));
    }
  }, [topology, id]);
  useEffect(load, [id, searchParams]);

  if (isLoading || topology == null) {
    return <Loading text="Loading topology..." />;
  }

  return (
    <SearchLayout
      title={
        <div className="flex text-xl  ">
          <Link to="/topology">Topology</Link>
          <TopologyBreadcrumbs topology={root} depth={3} />
        </div>
      }
      onRefresh={load}
    >
      <div className="flex leading-1.21rel">
        <div className="flex flex-wrap">
          {topology.map((item) => (
            <TopologyCard key={item.id} topology={item} size="medium" />
          ))}
        </div>
      </div>
    </SearchLayout>
  );
}
