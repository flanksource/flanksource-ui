type StatCardProps = {
  className?: string;
  title: string;
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
      <div className="flex flex-row gap-2 items-center justify-center">
        <div className="text-sm font-medium text-gray-500 truncate">
          {title}:
        </div>
        {customValue ? (
          <div className="font-semibold text-gray-900">{customValue}</div>
        ) : (
          <div className="font-semibold text-gray-900">{value}</div>
        )}
      </div>
    </div>
  );
}
