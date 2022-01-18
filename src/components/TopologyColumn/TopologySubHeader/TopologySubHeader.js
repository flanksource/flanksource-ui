import React from "react";

export const TopologySubHeader = () => (
  <div className="grid grid-cols-3 rounded-b-8px divide-x">
    <div>
      <div className="text-gray-800 px-2">
        <h3 className="text-gray-color text-9.64px font-medium">RPS:</h3>
        <h1 className="font-bold text-xs">165/s</h1>
      </div>
    </div>
    <div className="flex justify-center">
      <div className="text-gray-800 px-2">
        <h3 className="text-gray-color text-9.64px font-medium">Errors:</h3>
        <h1 className="font-bold text-xs">0.1%</h1>
      </div>
    </div>
    <div className="flex justify-center">
      <div className="text-gray-800 px-2">
        <h3 className="text-gray-color text-9.64px font-medium">Latency:</h3>
        <h1 className="font-bold text-xs">225ms</h1>
      </div>
    </div>
  </div>
);

TopologySubHeader.propTypes = {};
