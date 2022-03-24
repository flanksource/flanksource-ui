import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  decodeUrlSearchParams,
  updateParams
} from "../../components/Canary/url";

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

  useEffect(() => {
    const { selected } = decodeUrlSearchParams(window.location.search);
    if (selected) {
      const decoded = selected.split(",").map((str) => parseInt(str, 10));
      const newChecked = {};
      decoded.forEach((lineNum) => {
        newChecked[lineNum] = linesArrayWithIndex[lineNum];
      });
      setChecked(newChecked);
    }
  }, []);

  const getSelectedEncodedURL = () => {
    const selectedArr = Object.keys(checked);
    const encoded = encodeURIComponent(selectedArr);
    return encoded;
  };

  const handleCheck = (index, value) => {
    const newChecked = { ...checked };
    if (value) {
      newChecked[index] = linesArrayWithIndex[index];
      setChecked(newChecked);
    } else {
      const newChecked = { ...checked };
      delete newChecked[index];
      setChecked(newChecked);
    }

    updateParams({
      selected: Object.keys(newChecked).reduce(
        (acc, curr) => `${acc}${acc.length > 0 ? "," : ""}${curr}`,
        ""
      )
    });
  };

  const handleShare = () => {
    const { origin, pathname } = window.location;
    const copyString = `${origin}${pathname}?selected=${getSelectedEncodedURL()}`;
    navigator.clipboard.writeText(copyString).then(() => {
      toast("Copied to clipboard");
    });
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
                onClick={() => {
                  handleShare();
                }}
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
                  checked={checked[lineIndex]}
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
