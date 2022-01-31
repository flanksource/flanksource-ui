import React from "react";
import PropTypes from "prop-types";
import { TopologyColumn, TopologyCard } from "../../../components/Topology";
import {TopologyCardSmall2} from "../../../components/Topology/TopologyCard2/TopologyCard2";

export const TopologyPageMediumView = ({
  topology,
  checked,
  selectionMode,
  setSelectionMode,
  toggleChecked
}) => (
  <div className="font-inter flex leading-tightly">
    <div className="flex-auto">
      <p className="text-2xl my-6 font-semibold">Title</p>
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
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(2, 384px)" }}
      >
        <div>
          <TopologyColumn
            title="zone 1"
            cards={topology.map((item, index) => (
              <TopologyCardSmall2
                size="medium"
                key={item.id}
                topology={item}
                selectionMode={selectionMode}
                selected={!!checked[`column_1_card_${index}`]}
                onSelectionChange={(state) => {
                  toggleChecked(`column_1_card_${index}`, state);
                }}
              />
            ))}
          />
        </div>
        <div>
          <TopologyColumn
            title="zone 2"
            cards={topology.map((item, index) => (
              <TopologyCard
                size="medium"
                key={item.id}
                topology={item}
                selectionMode={selectionMode}
                selected={!!checked[`column_2_card_${index}`]}
                onSelectionChange={(state) => {
                  toggleChecked(`column_2_card_${index}`, state);
                }}
              />
            ))}
          />
        </div>
        <div>
          <TopologyColumn
            title="zone 3"
            cards={topology.map((item, index) => (
              <TopologyCard
                size="medium"
                key={item.id}
                topology={item}
                selectionMode={selectionMode}
                selected={!!checked[`column_3_card_${index}`]}
                onSelectionChange={(state) => {
                  toggleChecked(`column_3_card_${index}`, state);
                }}
              />
            ))}
          />
        </div>
      </div>
    </div>
  </div>
);

TopologyPageMediumView.propTypes = {
  topology: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};
