import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchLayout } from "../../components/Layout";
import jsonString from "../../data/sampleConfig.json";

const mockName = "package.json"; // TODO: get actual name from API call
const linesArray = JSON.stringify(jsonString, undefined, 4).split("\n");
const linesArrayWithIndex = linesArray.reduce((acc, currLine, idx) => {
  acc[idx] = currLine;
  return acc;
}, {});

export function ConfigDetailsPage() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState({});

  const handleCheck = (index, value) => {
    if (value) {
      const newChecked = { ...checked };
      newChecked[index] = linesArrayWithIndex[index];
      setChecked(newChecked);
    } else {
      const newChecked = { ...checked };
      delete newChecked[index];
      setChecked(newChecked);
    }
  };

  return (
    <SearchLayout title={`Config Details for ${mockName}`}>
      <div className="flex flex-col items-start">
        <div className="mb-4 flex flex-row iems-center">
          <button
            className="border rounded-md px-3 py-1 text-sm"
            type="button"
            onClick={() => navigate("/config")}
          >
            Back
          </button>
          {Object.keys(checked).length > 0 && (
            <>
              <div className="flex items-center mx-4">
                {Object.keys(checked).length} lines selected
              </div>
              <button
                className="border rounded-md px-3 py-1 mr-2 text-sm"
                type="button"
                onClick={() => {}}
              >
                Share
              </button>
              <button
                className="border rounded-md px-3 py-1 text-sm"
                type="button"
                onClick={() => {}}
              >
                Create Incident
              </button>
            </>
          )}
        </div>

        <div className="flex flex-col w-full">
          {Object.entries(linesArrayWithIndex).map(([lineIndex, line]) => (
            <div key={lineIndex} className="border flex flex-row">
              <div className="px-1 flex items-center justify-center">
                <input
                  value={Object.prototype.hasOwnProperty.call(
                    checked,
                    lineIndex
                  )}
                  type="checkbox"
                  onChange={(e) => handleCheck(lineIndex, e.target.checked)}
                />
              </div>

              <div className="border-l border-r w-10 mr-2 text-sm flex items-center justify-end px-1">
                {lineIndex}
              </div>
              <code className="whitespace-pre-wrap text-sm">{line}</code>
            </div>
          ))}
        </div>
      </div>
    </SearchLayout>
  );
}
