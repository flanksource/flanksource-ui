import clsx from "clsx";
import { FormatProperty } from "./Property";

interface IProps {
  items: {
    name: string;
    color?: string;
  };
  row?: boolean;
}

export const CardMetrics = ({ items, row }: IProps) => {
  return (
    <div className="flex rounded-b-8px divide-x flex-1 justify-between items-center">
      {items.map((item) => (
        <div
          key={item.name}
          className={clsx(
            "text-gray-800 px-2 align-middle text-center h-full  flex flex-1",
            {
              "flex-col": !row,
              "flex-row items-center justify-center": row
            }
          )}
        >
          <h6 className="text-gray-color text-xs mb-0.5">
            {item.label ?? item.name}
            {row && ":"}
          </h6>
          <span
            className={clsx(
              "font-bold text-xs leading-1.21rel flex flex-center justify-center",
              `text-${item.color}-500`,
              { "pl-1": row }
            )}
          >
            <FormatProperty property={item} short />
          </span>
        </div>
      ))}
    </div>
  );
};
