import { SearchIcon } from "@heroicons/react/solid";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { getLogs } from "../../api/services/logs";
import { timeRanges } from "../../components/Dropdown/TimeRange";
import { LogsViewer } from "../../components/Logs";
import { ReactSelectDropdown } from "../../components/ReactSelectDropdown";
import { TextInput } from "../../components/TextInput";

export function LogsPage() {
  const [logsIsLoading, setLogsIsLoading] = useState(true);
  const [logs, setLogs] = useState<any>([]);
  const loadLogs = () => {
    setLogsIsLoading(true);
    getLogs().then((res) => {
      if (res.data != null) {
        setLogs(res.data.results);
      }
      setLogsIsLoading(false);
    });
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const [searchIsDirty, setSearchIsDirty] = useState(false);
  const {
    control,
    watch,
    formState: { isDirty }
  } = useForm({
    defaultValues: {
      timeRange: timeRanges[0].value,
      searchQuery: ""
    }
  });

  const handleSearch = (searchQuery: string, timeRange: string) => {
    // eslint-disable-next-line no-console
    console.log("search", searchQuery, timeRange);
    // Call search API & update logs list here
  };

  const handleSearchDebounced = useRef(debounce(handleSearch, 700)).current;

  const watchTimeRange = watch("timeRange");
  const watchSearchQuery = watch("searchQuery");

  useEffect(() => {
    if (searchIsDirty) {
      handleSearchDebounced(watchSearchQuery, watchTimeRange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchSearchQuery, searchIsDirty]);

  useEffect(() => {
    if (searchIsDirty) {
      handleSearch(watchSearchQuery, watchTimeRange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchTimeRange, searchIsDirty]);

  useEffect(() => {
    setSearchIsDirty(true);
  }, [isDirty]);

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col justify-center">
      <div className="mt-4 w-full px-4">
        <div className="flex flex-row items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Logs</h1>
          <div className="flex items-center">
            <ReactSelectDropdown
              control={control}
              name="timeRange"
              className="w-44"
              items={timeRanges}
            />
            <div className="ml-4 w-72 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <Controller
                control={control}
                name="searchQuery"
                render={({ field }) => {
                  const { onChange, value } = field;
                  return (
                    <TextInput
                      placeholder="Search"
                      className="pl-10 pb-2.5 w-full"
                      style={{ height: "38px" }}
                      id="searchQuery"
                      onChange={onChange}
                      value={value}
                    />
                  );
                }}
              />
            </div>
          </div>
        </div>
        {/* @ts-expect-error */}
        <LogsViewer logs={logs} logsIsLoading={logsIsLoading} />
      </div>
    </div>
  );
}
