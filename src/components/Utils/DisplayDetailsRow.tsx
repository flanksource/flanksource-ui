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
    <div className="flex w-full flex-row gap-2">
      {items.map(({ label, value }) => (
        <div
          className={className}
          key={label?.toString()}
          data-testid="display-item-row"
        >
          <label className="overflow-hidden truncate text-sm text-gray-600">
            <span className="border-b border-dashed border-gray-500">
              {label}
            </span>
          </label>
          <div className="overflow-hidden whitespace-pre-wrap text-wrap break-all text-sm font-medium text-gray-900">
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}
