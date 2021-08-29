import "./style.css"
export function Status({ good, mixed, className = "" }) {
  if (mixed) {
    className += " bg-mixed";
  } else if (good) {
    className += " bg-green-400";
  } else {
    className += " bg-red-400";
  }
  return (
    <span
      className={`${className} flex-shrink-0 inline-block h-3 w-3 rounded-full shadow-md`}
      aria-hidden="true"
    />
  );
}
