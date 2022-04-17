import React, { useState } from "react";
import { MinimalLayout } from "../../components/Layout";
import jUnitData from "../../data/jUnit.json";
import { JUnit } from "../../components/JUnit";

export const JUnitPage = () => {
  const [isHidePassing, setIsHidePassing] = useState(true);
  const [isHideSummary, setIsHideSummary] = useState(false);
  return (
    <MinimalLayout>
      <div className="flex">
        <div className="form-check mb-5 mr-8">
          <input
            className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
            type="checkbox"
            id="hidePassingCheckbox"
            checked={isHidePassing}
            onClick={() => setIsHidePassing((isHidePassing) => !isHidePassing)}
          />
          <label
            className="form-check-label inline-block text-gray-800"
            htmlFor="hidePassingCheckbox"
          >
            Hide passing
          </label>
        </div>

        <div className="form-check mb-5">
          <input
            className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
            type="checkbox"
            id="hideStatusColCheckbox"
            checked={isHideSummary}
            onClick={() => setIsHideSummary((isHideSummary) => !isHideSummary)}
          />
          <label
            className="form-check-label inline-block text-gray-800"
            htmlFor="hideStatusColCheckbox"
          >
            Hide summary
          </label>
        </div>
      </div>

      <JUnit
        suites={jUnitData.suites}
        duration={jUnitData.duration}
        failed={jUnitData.failed}
        passed={jUnitData.passed}
        hidePassing={isHidePassing}
        hideSummary={isHideSummary}
      />
    </MinimalLayout>
  );
};
