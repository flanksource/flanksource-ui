import { v4 as uuidv4 } from "uuid";
import { rangeValues } from "./rangeValues";

export const TimeRangeList = ({ selected = false }) => {
  return (
    <ul>
      {rangeValues.map((range) => {
        const id = uuidv4();
        return (
          <li
            key={range.title}
            className="py-1 px-2 hover:bg-blue-200 flex justify-between items-center"
          >
            <label htmlFor={id} className="cursor-pointer w-full">
              {range.title}
            </label>
            <input
              type="radio"
              className="opacity-0 cursor-pointer"
              // checked={false}
              name="range-radio"
              id={id}
            />
          </li>
        );
      })}
    </ul>
  );
};
