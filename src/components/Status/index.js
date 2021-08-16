export default function Status({ state, className = "" }) {

  if (state == "ok") {
    className += " bg-green-400";
  } else if (state == "bad") {
    className += " bg-red-400";
  } else {
    className += " bg-gray-400"
  }
  return (
    <span
      className={`${className} flex-shrink-0 inline-block h-2 w-2 rounded-full shadow-md`}
      aria-hidden="true"
    ></span>

  )
}
