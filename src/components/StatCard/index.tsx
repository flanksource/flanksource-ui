type StatCardProps = {
  className?: string;
  title: React.ReactNode;
  value?: string;
  customValue?: React.ReactNode;
};

export function StatCard({
  className,
  title,
  value,
  customValue
}: StatCardProps) {
  return (
    <div className={`bg-white ${className}`}>
      <div className="flex flex-row items-center justify-center gap-1">
        <div className="flex flex-col items-center truncate text-xs text-gray-500">
          {title}
        </div>
        {customValue ? (
          <div className="text-sm font-semibold text-gray-900">
            {customValue}
          </div>
        ) : (
          <div className="text-sm font-semibold text-gray-900">{value}</div>
        )}
      </div>
    </div>
  );
}
