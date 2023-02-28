import style from "./style.module.css";

export function Status({ good, mixed, className = "" }) {
  const color = mixed ? style.mixed : good ? "bg-green-400" : "bg-red-400";
  return (
    <span
      className={`flex-shrink-0 inline-block h-3 w-3 rounded-full ${className} ${color}`}
      aria-hidden="true"
    />
  );
}
