export function DescriptionCard({ items }) {
  return (
    <div className="flex flex-col">
      <table className="table text-sm">
        <tbody>
          {items.map((item) => (
            <tr
              className="border-slate-100 border-solid border-b border-t p-1"
              key={item.name}
            >
              <th className="text-gray-700 font-light  uppercase text-left overflow-auto bg-zinc-50 pl-2">
                {item.label}{" "}
              </th>
              <td className="border-none p-1">{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
