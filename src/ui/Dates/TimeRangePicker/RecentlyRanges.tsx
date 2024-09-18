import { formatTimeRange } from "../../../utils/date";
import { TimeRangeAbsoluteOption, TimeRangeOption } from "./rangeOptions";

type RecentlyRangesProps = {
  recentRanges: TimeRangeAbsoluteOption[];
  applyTimeRange: (val: TimeRangeOption) => void;
};

export function RecentlyRanges({
  recentRanges = [],
  applyTimeRange = () => {}
}: RecentlyRangesProps) {
  return (
    <div>
      {Boolean(recentRanges.length) && (
        <div className="my-2 px-3 text-base font-semibold text-gray-500">
          Recently used absolute ranges
        </div>
      )}
      <div className="max-h-24 overflow-y-auto">
        {recentRanges?.map((range) => (
          <button
            type="button"
            onClick={() => applyTimeRange(range)}
            key={`${formatTimeRange(range.from)} to ${formatTimeRange(
              range.to
            )}`}
            className="flex w-full cursor-pointer justify-between px-3 py-1.5 text-left text-sm hover:bg-gray-100"
          >
            {`${formatTimeRange(range.from)} to ${formatTimeRange(range.to)}`}
          </button>
        ))}
      </div>
    </div>
  );
}
