export default function VerticalDescription({
  label,
  value
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col gap-1 xl:flex-none">
      <div className="overflow-hidden truncate text-sm text-gray-500">
        {label}
      </div>
      <div className="flex min-w-max justify-start break-all text-sm font-semibold">
        {value}
      </div>
    </div>
  );
}
