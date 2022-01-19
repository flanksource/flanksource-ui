import React from "react";

export const TopologySubHeader = () => (
  <div className="grid grid-cols-3 rounded-b-8px divide-x">
    <div>
      <div className="text-gray-800">
        <h3 className="text-gray-color text-2xs font-medium font-inter">
          RPS:
        </h3>
        <h1 className="font-bold text-xs">165/s</h1>
      </div>
    </div>
    <div className="flex justify-center">
      <div className="text-gray-800 px-2">
        <h3 className="text-gray-color text-2xs font-medium font-inter">
          Errors:
        </h3>
        <h1 className="font-bold text-xs">0.1%</h1>
      </div>
    </div>
    <div className="flex justify-center">
      <div className="text-gray-800 px-2">
        <h3 className="text-gray-color text-2xs font-medium font-inter">
          Latency:
        </h3>
        <h1 className="font-bold text-xs">225ms</h1>
      </div>
    </div>
  </div>
);

TopologySubHeader.propTypes = {};
