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
    <div className={`bg-white  ${className}`}>
      <div className="flex flex-row gap-1 items-center justify-center">
        <div className="flex flex-col items-center text-xs text-gray-500 truncate">
          {title}
        </div>
        {customValue ? (
          <div className="font-semibold text-sm text-gray-900">
            {customValue}
          </div>
        ) : (
          <div className="font-semibold text-sm text-gray-900">{value}</div>
        )}
      </div>
    </div>
  );
}
