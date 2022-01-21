import React from "react";

export const TopologyFullSubheader = () => (
  <div className="grid grid-cols-3 divide-x">
    <div className="text-gray-800 flex items-center h-4 justify-center my-auto">
      <h6 className="text-gray-color text-2xs font-medium font-inter">RPS:</h6>
      <span className="font-bold text-xs ml-1.5">165/s</span>
    </div>
    <div className="text-gray-800 flex items-center justify-center h-4 my-auto">
      <h6 className="text-gray-color text-2xs font-medium font-inter">
        Errors:
      </h6>
      <span className="font-bold text-xs ml-1.5">0.1%</span>
    </div>
    <div className="text-gray-800 flex items-center justify-center h-4 my-auto">
      <h6 className="text-gray-color text-2xs font-medium font-inter ml-4">
        Latency:
      </h6>
      <span className="font-bold text-xs ml-1.5">225ms</span>
    </div>
  </div>
);

TopologyFullSubheader.propTypes = {};
