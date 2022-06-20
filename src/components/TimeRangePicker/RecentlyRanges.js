import PropTypes from "prop-types";
import dayjs from "dayjs";
import { displayTimeFormat } from "./rangeOptions";

export const RecentlyRanges = ({ recentRanges, applyTimeRange }) => (
  <div>
    <div className="font-medium mt-3.5 px-3">
      Recently used absolute ranges:
    </div>
    <div>
      {recentRanges?.map((range) => (
        <button
          type="button"
          onClick={() => applyTimeRange(range)}
          key={`${dayjs(range.from).format()}${dayjs(range.to).format()}`}
          className="hover:bg-blue-100 flex justify-between items-center w-full cursor-pointer py-1.5 px-3"
        >
          {`${dayjs(range.from).format(displayTimeFormat)} to ${dayjs(
            range.to
          ).format(displayTimeFormat)}`}
        </button>
      ))}
    </div>
  </div>
);

RecentlyRanges.propTypes = {
  recentRanges: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  applyTimeRange: PropTypes.func
};

RecentlyRanges.defaultProps = {
  recentRanges: [],
  applyTimeRange: () => {}
};
