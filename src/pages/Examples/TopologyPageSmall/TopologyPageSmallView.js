import React from "react";
import PropTypes from "prop-types";

import { TopologyColumn } from "../../../components/TopologyColumn/TopologyColumn";
import { TopologyCardSmall } from "../../../components/TopologyColumn/TopologyCardSmall/TopologyCardSmall";
import { colorHandler } from "../../../utils/common";

export const TopologyPageSmallView = ({ topology }) => {
  const cards = topology.map(({ name, color }) => (
    <TopologyCardSmall
      key={name}
      title={name}
      color={colorHandler("border", color)}
    />
  ));
  return (
    <div className="font-inter flex">
      <div
        style={{ width: "226px" }}
        className="flex-0-0-a h-screen bg-column-background mr-4 lg"
      />
      <div className="flex-auto">
        <p className="text-2xl my-6">Title</p>
        <div className="grid grid-cols-4 xl:grid-cols-5 gap-4">
          <div>
            <TopologyColumn title="zone 1" cards={cards} />
          </div>
          <div>
            <TopologyColumn title="zone 2" cards={cards} />
          </div>
          <div>
            <TopologyColumn title="zone 3" cards={cards} />
          </div>
          <div>
            <TopologyColumn title="zone 4" cards={cards} />
          </div>
          <div>
            <TopologyColumn title="zone 5" cards={cards} />
          </div>
        </div>
      </div>
    </div>
  );
};

TopologyPageSmallView.propTypes = {
  topology: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};
