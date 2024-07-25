import { Icon } from "../../ui/Icons/Icon";
import { ConnectionType, connectionTypes } from "./connectionTypes";

type Props = {
  setConnectionType: (connectionType: ConnectionType) => void;
};

export default function ConnectionListView({ setConnectionType }: Props) {
  return (
    <div className="flex flex-wrap p-2">
      {connectionTypes.map((item) => {
        return (
          <div className="flex w-1/5 flex-col p-2" key={item.title}>
            <div
              role="button"
              className="flex h-20 flex-col items-center justify-center space-y-2 rounded-md border border-gray-300 p-2 text-center hover:border-blue-200 hover:bg-gray-100"
              onClick={(e) => {
                setConnectionType(item);
              }}
            >
              {typeof item.icon === "string" ? (
                <Icon name={item.icon} className="h-auto w-6" />
              ) : (
                item.icon
              )}
              <div>{item.title}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
