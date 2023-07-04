import clsx from "clsx";
import { NodePodPropToLabelMap } from "../../constants";

type DescriptionCardProps = React.HTMLProps<HTMLDivElement> & {
  items: {
    label?: string | React.ReactNode;
    value: React.ReactNode;
  }[];
  columns?: number;
  labelStyle?: "left" | "top";
};

export function DescriptionCard({
  items,
  labelStyle = "left",
  columns = 1,
  className,
  ...rest
}: DescriptionCardProps) {
  return (
    <div className={clsx("flex flex-col max-w-full", className)} {...rest}>
      {labelStyle === "left" && (
        <table className="table-auto shadow-none text-sm w-full max-w-full">
          <tbody>
            {items.map((item, index) => (
              <tr
                className="border-slate-100 border-solid border-b border-t px-1 py-0.5"
                key={(item.label ?? "") + index.toString()}
              >
                <th className="text-sm overflow-hidden truncate text-gray-500">
                  {NodePodPropToLabelMap[
                    item.label as keyof typeof NodePodPropToLabelMap
                  ] ?? item.label}{" "}
                </th>
                <td className="text-sm border-none break-all text-xs">
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
                <div className="text-sm overflow-hidden truncate text-gray-500">
                  {NodePodPropToLabelMap[
                    item.label as keyof typeof NodePodPropToLabelMap
                  ] ?? item.label}
                </div>
                <div className="flex justify-start text-sm">{item.value}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
