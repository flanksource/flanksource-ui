import clsx from "clsx";

type ConfigChangeDetailSectionProps = {
  label: string;
  children: React.ReactNode;
};

export default function ConfigChangeDetailSection({
  children
}: ConfigChangeDetailSectionProps) {
  return (
    <div className="mt-2 flex flex-1 flex-col overflow-y-auto">
      <div className="flex w-full flex-1 flex-col gap-4 overflow-y-auto">
        <div
          className={clsx(
            "flex w-full flex-1 overflow-x-auto overflow-y-auto rounded border border-gray-200 text-sm"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
