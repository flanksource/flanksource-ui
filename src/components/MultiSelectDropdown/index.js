import React from "react";
import Select from "react-select";
import "./index.css";

export function MultiSelectDropdown({ options, ...rest }) {
  return <Select isClearable isMulti options={options} {...rest} />;
}
