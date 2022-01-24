import React from "react";

export const SubHeaderMetrics = () => (
  <div className="grid auto-cols-min grid-flow-col divide-x flex-1 items-start pt-1.5">
    <div className="text-gray-800 flex items-baseline pr-2">
      <h6 className="text-gray-color text-xs leading-1.21rel font-medium mr-0.5">
        RPS:
      </h6>
      <span className="font-bold text-sm">165/s</span>
    </div>
    <div className="text-gray-800 flex items-baseline px-2">
      <h6 className="text-gray-color text-xs leading-1.21rel font-medium mr-0.5">
        Errors:
      </h6>
      <span className="font-bold text-sm">0.1%</span>
    </div>
    <div className="text-gray-800 flex items-baseline pl-2">
      <h6 className="text-gray-color text-xs leading-1.21rel font-medium mr-0.5">
        Latency:
      </h6>
      <span className="font-bold text-sm">225ms</span>
    </div>
  </div>
);

SubHeaderMetrics.propTypes = {};
