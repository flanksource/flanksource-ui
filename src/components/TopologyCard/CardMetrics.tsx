import clsx from "clsx";
import { Icon } from "../Icon";
import { FormatProperty } from "./Property";

interface IProps {
  items: {
    name: string;
    color?: string;
    label?: string;
    icon?: string;
  }[];
  row?: boolean;
  labelClasses?: string;
  metricsClasses?: string;
  containerClasses?: string;
  showLabelIcons?: boolean;
}

export const CardMetrics = ({
  items,
  row,
  showLabelIcons = false,
  containerClasses = "text-gray-800 px-2 align-middle text-center h-full  flex flex-1",
  labelClasses = "text-gray-color text-xs mb-0.5",
  metricsClasses = "font-bold text-xs leading-1.21rel flex flex-center justify-center"
}: IProps) => {
  return (
    <div className="flex rounded-b-8px divide-x flex-1 justify-between items-center">
      {items.map((item) => (
        <div
          key={item.name}
          className={clsx(containerClasses, {
            "flex-col": !row,
            "flex-row items-center justify-center": row
          })}
        >
          <h6 className={`space-x-2 ${labelClasses}`}>
            {showLabelIcons && (
              <Icon name={item.icon} className="w-5" secondary={item.name} />
            )}
            <span>
              {item.label ?? item.name}
              {row && ":"}
            </span>
          </h6>
          <span
            className={clsx(metricsClasses, `text-${item.color}-500`, {
              "pl-1": row
            })}
          >
            <FormatProperty property={item} short />
          </span>
        </div>
      ))}
    </div>
  );
};
