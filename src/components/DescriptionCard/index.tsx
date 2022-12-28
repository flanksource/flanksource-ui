type DescriptionCardProps = {
  items: {
    label?: string;
    value: React.ReactNode;
  }[];
};

export function DescriptionCard({ items }: DescriptionCardProps) {
  return (
    <div className="flex flex-col max-w-full">
      <table className="table-auto shadow-none text-sm w-full max-w-full">
        <tbody>
          {items.map((item, index) => (
            <tr
              className="border-slate-100 border-solid border-b border-t p-1"
              key={item.label ?? "" + index}
            >
              <th className="text-gray-700 font-light  uppercase text-left break-all bg-zinc-50 pl-2">
                {item.label}{" "}
              </th>
              <td className="border-none p-1 break-all">{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
