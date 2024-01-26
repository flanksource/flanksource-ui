import { useSearchParams } from "react-router-dom";
import DateTimeRangerPicker from "../../../../ui/Dates/DateTimeRangerPicker";

export default function ConfigChangesDateRangeFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const starts = searchParams.get("starts") ?? undefined;
  const ends = searchParams.get("ends") ?? undefined;

  return (
    <DateTimeRangerPicker
      value={{
        from: starts,
        to: ends
      }}
      label="Dates:"
      onChange={(from, to) => {
        if (from && to) {
          searchParams.set("starts", from);
          searchParams.set("ends", to);
        } else {
          searchParams.delete("starts");
          searchParams.delete("ends");
        }
        setSearchParams(searchParams);
      }}
    />
  );
}
