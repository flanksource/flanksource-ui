export const MORE_TIME_RANGE_BAR_WIDTH = 16;

export function MoreTimeRangeBar({
  left,
  onClick
}: {
  left: number;
  onClick: () => void;
}) {
  return (
    <div className="sticky top-0 z-30 h-0">
      <button
        type="button"
        title="Increase time range"
        aria-label="Increase time range"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="absolute top-0 flex h-screen items-center justify-center border-x border-gray-200 bg-gray-50 text-[9px] font-medium uppercase tracking-wide text-gray-400 hover:bg-blue-50 hover:text-blue-600"
        style={{ left, width: MORE_TIME_RANGE_BAR_WIDTH }}
      >
        <span className="[writing-mode:vertical-rl]">More</span>
      </button>
    </div>
  );
}
