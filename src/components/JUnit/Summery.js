import React, { useMemo } from "react";

export const Summary = ({ passed, failed, suites }) => {
  const total = useMemo(
    () => suites.reduce((acc, { tests }) => acc + tests.length, 0),
    [suites]
  );

  return (
    <div className="flex bg-gray-100 p-3 pl-10 text-center text-gray-600">
      <div className="pr-10">
        <p className="text-4xl">{total}</p>
        <p>Total tests</p>
      </div>
      <div className="flex pl-10 border-l">
        <div className="pr-10">
          <p className="text-4xl text-green-600">{passed}</p>
          <p>Passed</p>
        </div>
        <div>
          <p className="text-4xl text-red-400">{failed}</p>
          <p>Failed</p>
        </div>
      </div>
    </div>
  );
};
