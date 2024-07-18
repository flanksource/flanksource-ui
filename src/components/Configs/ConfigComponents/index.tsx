import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useConfigComponentsRelationshipQuery } from "../../../api/query-hooks/useConfigComponentsRelationshipQuery";
import { CountBadge } from "../../../ui/Badge/CountBadge";
import CollapsiblePanel from "../../../ui/CollapsiblePanel/CollapsiblePanel";
import { Icon } from "../../../ui/Icons/Icon";
import { TopologyIcon } from "../../../ui/Icons/TopologyIcon";
import TextSkeletonLoader from "../../../ui/SkeletonLoader/TextSkeletonLoader";

export type ConfigsComponents = {
  id: string;
  icon?: string;
  name: string;
};

type Props = {
  configID: string;
};

function ConfigComponentsDetails({ configID }: Props) {
  const { data: components = [], isLoading } =
    useConfigComponentsRelationshipQuery<Record<string, any>[]>(configID);

  return (
    <div className="flex flex-col space-y-2">
      {isLoading ? (
        <TextSkeletonLoader />
      ) : components.length > 0 ? (
        <ol className="w-full text-left text-sm">
          {components.map((analysis) => (
            <li className="" key={analysis.id}>
              <Link
                className="space-x-2"
                to={{
                  pathname: `/topology/${analysis.id}`
                }}
              >
                <Icon name={analysis.icon} secondary={analysis.name} />
                <span className="capitalize">{analysis.name}</span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <div className="flex flex-row items-center justify-center space-x-2 text-center text-gray-500">
          <FaExclamationTriangle />
          <span>No details found</span>
        </div>
      )}
    </div>
  );
}

export default function ConfigComponents(props: Props) {
  const { data: components = [] } = useConfigComponentsRelationshipQuery<
    Record<string, any>[]
  >(props.configID);

  return (
    <CollapsiblePanel
      Header={
        <div className="flex flex-row items-center space-x-2 text-xl font-semibold">
          <TopologyIcon className="h-5 w-5 text-gray-400" />
          <span>Components</span>
          <CountBadge roundedClass="rounded-full" value={components.length} />
        </div>
      }
      dataCount={components.length}
    >
      <ConfigComponentsDetails {...props} />
    </CollapsiblePanel>
  );
}
