export function Status({ good, mixed, className = "" }) {
  const color = mixed
    ? "bg-light-orange"
    : good
    ? "bg-green-400"
    : "bg-red-400";
  return (
    <span
      className={`flex-shrink-0 inline-block h-3 w-3 rounded-full shadow-md ${className} ${color}`}
      aria-hidden="true"
    />
  );
}
