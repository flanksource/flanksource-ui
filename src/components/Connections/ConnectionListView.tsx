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
          <div className="flex flex-col w-1/5 p-2" key={item.title}>
            <div
              role="button"
              className="flex flex-col items-center space-y-2 justify-center p-2 border border-gray-300 hover:border-blue-200 hover:bg-gray-100 rounded-md text-center h-20"
              onClick={(e) => {
                setConnectionType(item);
              }}
            >
              {typeof item.icon === "string" ? (
                <Icon name={item.icon} className="w-6 h-auto" />
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
