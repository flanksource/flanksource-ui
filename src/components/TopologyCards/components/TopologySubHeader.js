import React from "react";

export const TopologySubHeader = () => (
  <div className="grid grid-cols-3 rounded-b-8px divide-x">
    <div>
      <div className="text-gray-800">
        <h6 className="text-gray-color text-2xs font-medium font-inter">
          RPS:
        </h6>
        <span className="font-bold text-xs">165/s</span>
      </div>
    </div>
    <div className="flex justify-center">
      <div className="text-gray-800 px-2">
        <h6 className="text-gray-color text-2xs font-medium font-inter">
          Errors:
        </h6>
        <span className="font-bold text-xs">0.1%</span>
      </div>
    </div>
    <div className="flex justify-center">
      <div className="text-gray-800 px-2">
        <h6 className="text-gray-color text-2xs font-medium font-inter">
          Latency:
        </h6>
        <span className="font-bold text-xs">225ms</span>
      </div>
    </div>
  </div>
);

TopologySubHeader.propTypes = {};
