import React from "react";
import PropTypes from "prop-types";
import { TopologyColumn } from "../../../components/TopologyColumn/TopologyColumn";
import { TopologyCardMedium } from "../../../components/TopologyCards";

export const TopologyPageMediumView = ({ topology }) => (
  <div className="font-inter flex">
    <div
      style={{ width: "226px" }}
      className="flex-0-0-a h-screen bg-column-background mr-4 lg"
    />
    <div className="flex-auto">
      <p className="text-2xl my-6 font-semibold">Title</p>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        <div>
          <TopologyColumn
            title="zone 1"
            cards={topology.map(({ name, properties, status }) => (
              <TopologyCardMedium
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
              <TopologyCardMedium
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
            title="zone 3"
            cards={topology.map(({ name, properties, status }) => (
              <TopologyCardMedium
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

TopologyPageMediumView.propTypes = {
  topology: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};
