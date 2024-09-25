import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { useMemo } from "react";
import { Connection } from "./ConnectionFormModal";
import { connectionTypes } from "./connectionTypes";

type ConnectionIconProps = {
  connection: Pick<Connection, "type" | "name" | "id">;
  showLabel?: boolean;
};
export default function ConnectionIcon({
  connection,
  showLabel = false
}: ConnectionIconProps) {
  const icon = useMemo(() => {
    return connectionTypes.find((item) => item.value === connection.type)?.icon;
  }, [connection.type]);

  return (
    <div className="flex flex-row items-center gap-1">
      {typeof icon === "string" ? (
        <Icon name={icon} className="h-5" />
      ) : (
        // if not a string, it's a react component
        // eslint-disable-next-line react/jsx-no-useless-fragment
        icon && <>{icon}</>
      )}
      {showLabel && <span>{connection.name}</span>}
    </div>
  );
}
