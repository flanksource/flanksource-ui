import dayjs, { Dayjs } from "dayjs";
import { useCallback, useState } from "react";

type DateRangerPickerProps = {
  label?: string;
  // dates are string in ISO format
  onChange?: (from: string, to: string) => void;
  value?: {
    from?: string;
    to?: string;
  };
  maxDate?: string;
};

export default function DateTimeRangerPicker({
  label,
  value,
  onChange = () => {},
  maxDate = dayjs().format("YYYY-MM-DDTHH:mm:ss")
}: DateRangerPickerProps) {
  const [from, setFrom] = useState<Dayjs | undefined>(() => {
    if (value?.from) {
      return dayjs(value.from);
    }
    return undefined;
  });

  const [to, setTo] = useState<Dayjs | undefined>(() => {
    if (value?.to) {
      return dayjs(value.to);
    }
    return undefined;
  });

  console.log({ to, from, value });

  const handleOnChange = useCallback(
    (from: Dayjs | undefined, to: Dayjs | undefined) => {
      if (from && to) {
        onChange?.(from.toISOString(), to.toISOString());
      }
    },
    [onChange]
  );

  return (
    <div className="flex flex-row items-center gap-2">
      <label className="text-xs font-semibold text-gray-400">{label}</label>
      <div className="flex flex-row items-center">
        <div className="flex h-full flex-row items-center rounded-md rounded-r-none border border-r-0 border-gray-300 px-1 pl-2 shadow-sm focus:border-blue-500 focus:ring-blue-500">
          <label htmlFor="starts" className="text-xs text-gray-400">
            From:
          </label>
          <input
            className="w-auto border-0 shadow-sm focus:border-0 sm:text-sm"
            type="datetime-local"
            max={maxDate}
            onChange={(value) => {
              if (value.target.value) {
                setFrom(dayjs(value.target.value));
                handleOnChange(dayjs(value.target.value), to);
              }
            }}
            value={from ? dayjs(from).format("YYYY-MM-DDTHH:mm:ss") : undefined}
            id="starts"
          />
        </div>
        <div className="flex h-full flex-row items-center rounded-md rounded-l-none border border-l-0 border-gray-300 px-1 shadow-sm focus:border-blue-500 focus:ring-blue-500">
          <label htmlFor="ends" className="text-xs text-gray-400">
            To:
          </label>
          <input
            disabled={!from}
            min={dayjs(from).format("YYYY-MM-DDTHH:mm:ss")}
            max={maxDate}
            className="w-auto border-0 shadow-sm focus:border-0 sm:text-sm"
            type="datetime-local"
            value={to ? dayjs(to).format("YYYY-MM-DDTHH:mm:ss") : undefined}
            onChange={(value) => {
              if (value.target.value) {
                setTo(dayjs(value.target.value));
                handleOnChange(from, dayjs(value.target.value));
              }
            }}
            id="ends"
          />
        </div>
      </div>
    </div>
  );
}
