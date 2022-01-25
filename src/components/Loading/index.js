export function Loading({ text = "Loading..." }) {
  return (
    <div className="flex justify-center items-center">
      <div
        className="spinner-border animate-spin inline-block w-6 h-6 border-2 rounded-full"
        role="status"
      >
        <span className="visually-hidden"> </span>
      </div>
      <span className="text-sm ml-3">{text}</span>
    </div>
  );
}
