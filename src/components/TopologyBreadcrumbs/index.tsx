import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import { Loading } from "../Loading";
import { useTopologyBreadcrumb } from "../../hooks/userTopologyBreadcrumb";

type Props = {
  topologyId?: string;
};

export function TopologyBreadcrumbs({ topologyId }: Props) {
  const { isLoading, pathTopology } = useTopologyBreadcrumb({ topologyId });

  if (isLoading) {
    return <Loading text=".." />;
  }

  return (
    <>
      <Link to="/topology" className="hover:text-gray-500 ">
        Topology
      </Link>
      {pathTopology?.map(({ id, text, icon, name }) => (
        <>
          &nbsp;/&nbsp;
          <Link
            to={{
              pathname: `/topology/${id}`
            }}
            className="flex flex-nowrap hover:text-gray-500 my-auto "
          >
            <Icon name={icon} size="xl" className="mr-1" />
            {name || text}
          </Link>
        </>
      ))}
    </>
  );
}
