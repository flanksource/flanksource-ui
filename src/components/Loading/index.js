export function Loading({ text = "Loading..." }) {
  return (
    <div class="flex justify-center items-center">
      <div class="spinner-border animate-spin inline-block w-6 h-6 border-2 rounded-full" role="status">
        <span class="visually-hidden"> </span>
      </div>
      <span class="text-sm ml-3">{text}</span>
    </div>
  );
}
