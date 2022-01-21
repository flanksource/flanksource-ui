import React from "react";
import PropTypes from "prop-types";
import { TopologyColumn } from "../../../components/TopologyColumn/TopologyColumn";
import { TopologyCard } from "../../../components/TopologyCard/TopologyCard";
import { properties } from "../../../data/topologyDatas";

export const TopologyPageLargeView = ({
  topology,
  checked,
  selectionMode,
  setSelectionMode,
  toggleChecked
}) => (
  <div className="font-inter flex leading-1.21rel">
    <div
      style={{ width: "226px" }}
      className="flex-0-0-a h-screen bg-column-background mr-4 lg"
    />
    <div className="flex-auto">
      <h1 className="text-2xl my-6 font-semibold">Title</h1>
      <div className="form-check mb-4">
        <input
          id="ch1"
          type="checkbox"
          className="h-4 w-4 text-dark-blue rounded-4px"
          checked={selectionMode}
          onChange={(event) => {
            setSelectionMode(event.target.checked);
          }}
        />
        <label className="form-check-label inline-block ml-4" htmlFor="ch1">
          Selection Mode
        </label>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-1 gap-4">
        <div style={{ width: "578px" }}>
          <TopologyColumn
            title="zone 1"
            cards={topology.map(({ name, status }, index) => (
              <TopologyCard
                size="large"
                key={name}
                properties={properties}
                status={status}
                name="Pet Service"
                selectionMode={selectionMode}
                selected={!!checked[`column_1_card_${index}`]}
                onSelectionChange={(event) => {
                  toggleChecked(`column_1_card_${index}`, event.target.checked);
                }}
              />
            ))}
          />
        </div>
        <div style={{ width: "578px" }}>
          <TopologyColumn
            title="zone 2"
            cards={topology.map(({ name, status }, index) => (
              <TopologyCard
                size="large"
                key={name}
                properties={properties}
                status={status}
                name="Pet Service"
                selectionMode={selectionMode}
                selected={!!checked[`column_2_card_${index}`]}
                onSelectionChange={(event) => {
                  toggleChecked(`column_2_card_${index}`, event.target.checked);
                }}
              />
            ))}
          />
        </div>
      </div>
    </div>
  </div>
);

TopologyPageLargeView.propTypes = {
  topology: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};
