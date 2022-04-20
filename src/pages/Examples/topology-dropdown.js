import React, { useCallback, useState } from "react";
import { MinimalLayout } from "../../components/Layout";
import { TypologyDropdown } from "../../components/TopologyDropdown";
import { topologiesFactory } from "../../data/topologies";

const topologies = topologiesFactory(22);

export const TypologyDropdownDemo = () => {
  const [selectTopology, setSelectTopology] = useState(null);
  const [isMulti, setIsMulti] = useState(false);
  const searchTopology = useCallback(
    // (name) =>
    () =>
      new Promise(
        (
          resolve
          // , reject
        ) => {
          resolve(topologies); // todo remove this if getTopology works
          // getTopology({ name }).then(({ data }) => resolve(data));
        }
      ),
    []
  );

  return (
    <MinimalLayout>
      <div className="form-check mb-5">
        <input
          className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
          type="checkbox"
          id="flexCheckDefault"
          onClick={() => setIsMulti((isMulti) => !isMulti)}
        />
        <label
          className="form-check-label inline-block text-gray-800"
          htmlFor="flexCheckDefault"
        >
          Is multi value
        </label>
      </div>

      <TypologyDropdown
        onSearch={searchTopology}
        onSelect={setSelectTopology}
        multiple={isMulti}
      />
      <div className="mt-3">
        <p>Selected topology: </p>
        <pre>{JSON.stringify(selectTopology, null, "\t")}</pre>
      </div>
    </MinimalLayout>
  );
};
