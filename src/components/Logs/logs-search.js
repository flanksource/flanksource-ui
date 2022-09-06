import { SearchIcon } from "@heroicons/react/solid";
import React from "react";
import { Controller } from "react-hook-form";
import { Dropdown } from "../Dropdown";
import { timeRanges } from "../Dropdown/TimeRange";
import { ReactSelectDropdown } from "../ReactSelectDropdown";
import { TextInput } from "../TextInput";

export function LogSearchBar({ control }) {
  return (
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
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
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
  );
}
