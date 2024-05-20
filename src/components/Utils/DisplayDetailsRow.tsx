import { ReactNode } from "react";

type DisplayDetailsRowProps = {
  items: {
    label: ReactNode;
    value: ReactNode;
  }[];
  className?: string;
};

export default function DisplayDetailsRow({
  items,
  className = "flex flex-col flex-1"
}: DisplayDetailsRowProps) {
  return (
    <div className="flex flex-row gap-2 w-full">
      {items.map(({ label, value }) => (
        <div
          className={className}
          key={label?.toString()}
          data-testid="display-item-row"
        >
          <label className="text-sm overflow-hidden truncate text-gray-600 ">
            <span className="border-b border-dashed border-gray-500">
              {label}
            </span>
          </label>
          <p className="text-sm text-gray-900 font-medium break-all overflow-hidden whitespace-pre-wrap text-wrap">
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}
