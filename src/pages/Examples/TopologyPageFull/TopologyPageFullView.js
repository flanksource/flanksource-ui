import React from "react";
import PropTypes from "prop-types";
import { TopologyColumn } from "../../../components/TopologyColumn/TopologyColumn";
import { TopologyCard } from "../../../components/TopologyCards/TopologyCard";

export const TopologyPageFullView = ({ topology }) => (
  <div className="font-inter flex">
    <div
      style={{ width: "226px" }}
      className="flex-0-0-a h-screen bg-column-background mr-4 lg"
    />
    <div className="flex-auto">
      <h1 className="text-2xl my-6 font-semibold">Title</h1>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div>
          <TopologyColumn
            title="zone 1"
            cards={topology.map(({ name, properties, status }) => (
              <TopologyCard
                variant="full"
                key={name}
                properties={properties}
                status={status}
                name={name}
              />
            ))}
          />
        </div>
        <div>
          <TopologyColumn
            title="zone 2"
            cards={topology.map(({ name, properties, status }) => (
              <TopologyCard
                variant="full"
                key={name}
                properties={properties}
                status={status}
                name={name}
              />
            ))}
          />
        </div>
      </div>
    </div>
  </div>
);

TopologyPageFullView.propTypes = {
  topology: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};
