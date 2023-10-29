import { ReactElement } from "react";

export default function VerticalDescription({
  label,
  value
}: {
  label: string;
  value: ReactElement;
}) {
  return (
    <div className="flex flex-col gap-2 px-2 flex-1 xl:flex-none">
      <div className="text-sm overflow-hidden truncate text-gray-500">
        {label}
      </div>
      <div className="flex justify-start break-all text-sm font-semibold">
        {value}
      </div>
    </div>
  );
}
