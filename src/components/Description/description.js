export function Description({ label, value }) {
  return (
    <div>
      <h2 className="text-sm font-medium text-gray-500">{label}</h2>
      <div className="mt-1 space-y-1">
        <div className="flex justify-start">{value}</div>
      </div>
    </div>
  );
}
