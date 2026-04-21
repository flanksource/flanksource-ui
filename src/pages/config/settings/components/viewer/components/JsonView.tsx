import { useState } from "react";

interface Props {
  data: any;
  name?: string;
  depth?: number;
}

export function JsonView({ data, name, depth = 0 }: Props) {
  const [open, setOpen] = useState(depth < 2);

  if (data === null || data === undefined) {
    return <span className="italic text-gray-400">null</span>;
  }

  if (typeof data === "string") {
    return <span className="text-green-700">"{data}"</span>;
  }

  if (typeof data === "number" || typeof data === "boolean") {
    return <span className="text-blue-700">{String(data)}</span>;
  }

  const isArray = Array.isArray(data);
  const entries: [string | number, any][] = isArray
    ? data.map((v: any, i: number) => [i, v])
    : (Object.entries(data) as [string, any][]);
  const bracket = isArray ? ["[", "]"] : ["{", "}"];

  if (entries.length === 0) {
    return (
      <span className="text-gray-400">
        {bracket[0]}
        {bracket[1]}
      </span>
    );
  }

  return (
    <div
      className="font-mono text-sm"
      style={{ paddingLeft: depth > 0 ? "12px" : "0" }}
    >
      <button
        type="button"
        className="cursor-pointer select-none rounded bg-transparent px-0.5 text-left font-mono hover:bg-gray-100"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className="mr-1 text-xs text-gray-400">{open ? "▼" : "▶"}</span>
        {name && <span className="text-purple-600">{name}</span>}
        {name && <span className="text-gray-400">: </span>}
        {!open && (
          <span className="text-gray-400">
            {bracket[0]} {entries.length} {isArray ? "items" : "keys"}{" "}
            {bracket[1]}
          </span>
        )}
        {open && <span className="text-gray-400">{bracket[0]}</span>}
      </button>
      {open && (
        <>
          {entries.map(([key, val]) => (
            <div key={key} className="ml-1 border-l border-gray-200 pl-3">
              {typeof val === "object" && val !== null ? (
                <JsonView data={val} name={String(key)} depth={depth + 1} />
              ) : (
                <div>
                  <span className="text-purple-600">
                    {isArray ? "" : String(key)}
                  </span>
                  {!isArray && <span className="text-gray-400">: </span>}
                  <JsonView data={val} depth={depth + 1} />
                </div>
              )}
            </div>
          ))}
          <span className="text-gray-400">{bracket[1]}</span>
        </>
      )}
    </div>
  );
}
