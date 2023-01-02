import clsx from "clsx";

type DescriptionCardProps = React.HTMLProps<HTMLDivElement> & {
  items: {
    label?: string | React.ReactNode;
    value: React.ReactNode;
  }[];
  noOfCols?: number;
  labelStyle?: "left" | "top";
};

export function DescriptionCard({
  items,
  labelStyle = "left",
  noOfCols = 1,
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
                className="border-slate-100 border-solid border-b border-t p-1"
                key={(item.label ?? "") + index.toString()}
              >
                <th className="text-gray-700 font-light  uppercase text-left break-all bg-zinc-50 pl-2">
                  {item.label}{" "}
                </th>
                <td className="border-none p-1 break-all">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {labelStyle === "top" && (
        <div className={clsx("grid gap-4", `sm:grid-cols-${noOfCols}`)}>
          {items.map((item, index) => {
            return (
              <div className="col-span-1" key={index}>
                <h2 className="text-sm font-medium text-gray-500">
                  {item.label}
                </h2>
                <div className="mt-1 space-y-1">
                  <div className="flex justify-start">{item.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
