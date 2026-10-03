export function ResizeHandle({
  onMouseDown
}: {
  onMouseDown: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:border-r hover:border-gray-400"
      onMouseDown={onMouseDown}
    />
  );
}
