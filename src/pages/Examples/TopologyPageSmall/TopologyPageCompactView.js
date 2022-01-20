import React from "react";
import PropTypes from "prop-types";

import { TopologyColumn } from "../../../components/TopologyColumn/TopologyColumn";
import { TopologyCard } from "../../../components/TopologyCards/TopologyCard";

export const TopologyPageCompactView = ({ topology }) => (
  <div className="font-inter flex">
    <div
      style={{ width: "226px" }}
      className="flex-0-0-a h-screen bg-column-background mr-4 lg"
    />
    <div className="flex-auto">
      <p className="text-2xl my-6">Title</p>
      <div className="grid grid-cols-4 xl:grid-cols-5 gap-4">
        <div>
          <TopologyColumn
            title="zone 1"
            cards={topology.map(({ name, status, properties }) => (
              <TopologyCard
                size="compact"
                key={name}
                name={name}
                status={status}
                properties={properties}
              />
            ))}
          />
        </div>
        <div>
          <TopologyColumn
            title="zone 2"
            cards={topology.map(({ name, status, properties }) => (
              <TopologyCard
                size="compact"
                key={name}
                name={name}
                status={status}
                properties={properties}
              />
            ))}
          />
        </div>
        <div>
          <TopologyColumn
            title="zone 3"
            cards={topology.map(({ name, status, properties }) => (
              <TopologyCard
                size="compact"
                key={name}
                name={name}
                status={status}
                properties={properties}
              />
            ))}
          />
        </div>
        <div>
          <TopologyColumn
            title="zone 4"
            cards={topology.map(({ name, status, properties }) => (
              <TopologyCard
                size="compact"
                key={name}
                name={name}
                status={status}
                properties={properties}
              />
            ))}
          />
        </div>
        <div>
          <TopologyColumn
            title="zone 5"
            cards={topology.map(({ name, status, properties }) => (
              <TopologyCard
                size="compact"
                key={name}
                name={name}
                status={status}
                properties={properties}
              />
            ))}
          />
        </div>
      </div>
    </div>
  </div>
);

TopologyPageCompactView.propTypes = {
  topology: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};
