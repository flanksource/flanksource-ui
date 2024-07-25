import clsx from "clsx";
import { Icon } from "../../../ui/Icons/Icon";
import { FormatProperty } from "./FormatProperty";

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
  labelClasses = "text-gray-600 font-semibold text-xs mb-0.5",
  metricsClasses = "font-bold text-xs leading-1.21rel flex flex-center justify-center"
}: IProps) => {
  return (
    <div className="flex flex-1 items-center justify-between divide-x rounded-b-8px">
      {items.map((item) => (
        <div
          key={item.name}
          className={clsx(containerClasses, {
            "max-w-[15ch] flex-col": !row,
            "max-w-[15ch] flex-row items-center justify-center": row
          })}
        >
          <h6 className={`space-x-2 whitespace-nowrap ${labelClasses}`}>
            {showLabelIcons && (
              <Icon name={item.icon} className="w-5" secondary={item.name} />
            )}
            <span>
              {item.label ?? item.name} {row && ":"}
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
