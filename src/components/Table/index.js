

export default function Table({ columns, data, id }) {
  columns = columns.map((c) => {
    if (typeof (c) === "string") {
      return { name: c }
    }
    return c
  })
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column, cidx) =>
                    <th
                      key={`${id}.h${cidx}`}
                      scope="col"
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className}`}
                    >
                      {column.name}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, idx) => (
                  <tr key={`${id}.${idx}`}>
                    {columns.map((column, cidx) => (
                      <td key={`${id}.c${cidx}`} className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{row[column.name.toLowerCase()]}</div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
