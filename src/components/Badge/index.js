export function Badge({ text, size = "sm", dot }) {
  let spanClassname = "text-xs px-2";
  let svgClassName = "-ml-0.5 mr-1.5 h-2 w-2";
  if (size === "sm") {
    spanClassname = "text-sm px-2.5";
    svgClassName = "mr-1.5 h-2 w-2";
  }
  return (
    <>
      <span
        className={`${spanClassname} inline-flex items-center py-0.5 rounded font-medium bg-indigo-100 text-indigo-800`}
      >
        {dot != null && (
          <svg
            className={`${svgClassName} text-indigo-400" fill="${dot}" viewBox="0 0 8 8"`}
          >
            <circle cx={4} cy={4} r={3} />
          </svg>
        )}
        {text}
      </span>
    </>
  );
}
