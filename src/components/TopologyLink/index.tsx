import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import { useComponentNameQuery } from "../../api/query-hooks";

export function TopologyLink({
  topologyId,
  viewType = "link",
  size = "xl"
}: {
  topologyId: string | undefined;
  viewType?: "link" | "label";
  size?: "xl" | "lg" | "md" | "sm" | "xs";
}) {
  const { data: component } = useComponentNameQuery(topologyId, {});

  if (!component) {
    return null;
  }

  if (viewType === "link") {
    return (
      <Link
        to={{
          pathname: `/topology/${component.id}`
        }}
        className="flex flex-nowrap hover:text-gray-500 my-auto"
      >
        <Icon name={component.icon} className="mr-1 object-center" />
        <span className={`text-${size}`}> {component.name}</span>
      </Link>
    );
  }

  return (
    <>
      <Icon name={component.icon} className="mr-1 object-center" />
      <span className={`text-${size}`}> {component.name}</span>
    </>
  );
}
