import { v4 as uuidv4 } from "uuid";

export const TimeRangeList = ({selected = false}) => {

  const rangeValues = [
    {title: '1 hour', value: 1},
    {title: '2 hours', value: 2},
    {title: '3 hours', value: 3},
    {title: '4 hours', value: 4},
    {title: '5 hours', value: 5},
    {title: '6 hours', value: 6},
    {title: '12 hours', value: 7},
    {title: '24 hours', value: 8},
    {title: '2 days', value: 9},
    {title: '3 days', value: 10},
    {title: '4 days', value: 11},
    {title: '5 days', value: 12},
    {title: '6 days', value: 13},
    {title: '7 days', value: 14},
    {title: '2 weeks', value: 15},
    {title: '3 weeks', value: 16},
    {title: '1 month', value: 17},
  ];

  return (
    <ul>
      {rangeValues.map((range) => {
        const id = uuidv4();
        return <li key={range.title} className="py-1 px-2 hover:bg-blue-200 flex justify-between items-center">
          <label htmlFor={id} className="cursor-pointer w-full">{range.title}</label>
          <input
            type="radio"
            className="opacity-0 cursor-pointer"
            // checked={false}
            name="range-radio"
            id={id}
          />
        </li>
      })}
    </ul>
  )
}