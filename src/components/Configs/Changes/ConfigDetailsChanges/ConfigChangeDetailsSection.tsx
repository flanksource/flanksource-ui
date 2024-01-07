import clsx from "clsx";

type ConfigChangeDetailSectionProps = {
  label: string;
  children: React.ReactNode;
};

export default function ConfigChangeDetailSection({
  children
}: ConfigChangeDetailSectionProps) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto mt-2">
      <div className="flex flex-col flex-1 overflow-y-auto w-full gap-4">
        <div
          className={clsx(
            "flex flex-1 w-full overflow-y-auto overflow-x-auto border border-gray-200 rounded text-sm"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
