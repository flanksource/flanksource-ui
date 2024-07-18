import clsx from "clsx";
import { NodePodPropToLabelMap } from "../../constants";

type DescriptionCardProps = React.HTMLProps<HTMLDivElement> & {
  items: {
    label?: string | React.ReactNode;
    value: React.ReactNode;
  }[];
  columns?: number;
  labelStyle?: "left" | "top" | "column";
  contentClassName?: string;
};

export function DescriptionCard({
  items,
  labelStyle = "left",
  columns = 1,
  className,
  contentClassName = "flex justify-start break-all text-sm",
  ...rest
}: DescriptionCardProps) {
  return (
    <div className={clsx("flex max-w-full flex-col", className)} {...rest}>
      {labelStyle === "left" && (
        <table className="w-full max-w-full table-auto text-sm shadow-none">
          <tbody>
            {items.map((item, index) => (
              <tr
                className="border-b border-t border-solid border-slate-100 px-1 py-0.5"
                key={(item.label ?? "") + index.toString()}
              >
                <th className="overflow-hidden truncate text-sm text-gray-500">
                  {NodePodPropToLabelMap[
                    item.label as keyof typeof NodePodPropToLabelMap
                  ] ?? item.label}{" "}
                </th>
                <td
                  className={`break-all border-none text-xs ${contentClassName}`}
                >
                  {item.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {labelStyle === "top" && (
        <div
          className={clsx("grid gap-2.5")}
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
          }}
        >
          {items.map((item, index) => {
            return (
              <div className="col-span-1 flex flex-col space-y-0.5" key={index}>
                <div className="overflow-hidden truncate text-sm text-gray-500">
                  {NodePodPropToLabelMap[
                    item.label as keyof typeof NodePodPropToLabelMap
                  ] ?? item.label}
                </div>
                <div className={contentClassName}>{item.value}</div>
              </div>
            );
          })}
        </div>
      )}
      {labelStyle === "column" && (
        <div className={clsx("flex flex-1 flex-col gap-2 overflow-y-auto")}>
          {items.map((item, index) => {
            return (
              <div
                className="flex flex-col space-y-0.5 overflow-y-auto"
                key={index}
              >
                <div className="overflow-hidden truncate text-sm text-gray-500">
                  {NodePodPropToLabelMap[
                    item.label as keyof typeof NodePodPropToLabelMap
                  ] ?? item.label}
                </div>
                <div className={contentClassName}>{item.value}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
