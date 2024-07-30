import { Meta, StoryFn } from "@storybook/react";
import React from "react";
import { useSearchParams } from "react-router-dom";

import { JSONViewer } from "../Code/JSONViewer";
import FilterByCellValue from "./FilterByCellValue";

export default {
  title: "FilterByCellValue",
  component: FilterByCellValue,
  decorators: [(Story: React.FC) => <Story />]
} satisfies Meta<typeof FilterByCellValue>;

const Template: StoryFn<typeof FilterByCellValue> = (arg) => {
  const [searchParams] = useSearchParams();

  const jsonSearchParams = JSON.stringify(
    Object.fromEntries(searchParams.entries()),
    null,
    2
  );

  return (
    <div className="flex flex-col">
      <JSONViewer code={jsonSearchParams} format={"json"} />

      <FilterByCellValue paramKey={"key1"} filterValue={"value1"}>
        paramKey: key1, filterValue: value1
      </FilterByCellValue>

      <FilterByCellValue paramKey={"key2"} filterValue={"value2"}>
        paramKey: key2, filterValue: value2
      </FilterByCellValue>

      <FilterByCellValue paramKey={"key3"} filterValue={"value3"}>
        paramKey: key3, filterValue: value3
      </FilterByCellValue>
    </div>
  );
};

export const Default = Template.bind({});
