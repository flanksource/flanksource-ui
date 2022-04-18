import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  decodeUrlSearchParams,
  updateParams
} from "../../components/Canary/url";

import { SearchLayout } from "../../components/Layout";
import { toastError } from "../../components/Toast/toast";
import { Modal } from "../../components/Modal";
import { IncidentCreate } from "../../components/Incidents/IncidentCreate";
import { getConfig } from "../../api/services/configs";
import { Loading } from "../../components/Loading";

export function ConfigDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [checked, setChecked] = useState({});
  const [configDetails, setConfigDetails] = useState();
  const [jsonLines, setJsonLines] = useState([]);

  useEffect(() => {
    getConfig(id)
      .then((res) => {
        setConfigDetails(res?.data[0]);
      })
      .catch((err) => toastError(err))
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const json = configDetails?.config;
    if (json) {
      const jsonLines = json.split("\n");
      setJsonLines(
        jsonLines.reduce((acc, currLine, idx) => {
          acc[idx] = currLine;
          return acc;
        }, {})
      );
      const { selected } = decodeUrlSearchParams(window.location.search);
      if (selected) {
        const newChecked = selected.reduce((acc, lineNum) => {
          acc[lineNum] = true;
          return acc;
        }, {});
        setChecked(newChecked);
      }
    }
  }, [configDetails]);

  const handleClick = (index) => {
    const selected = !checked[index];
    const newChecked = { ...checked };
    newChecked[index] = selected;
    if (!selected) {
      delete newChecked[index];
    }
    setChecked(newChecked);
    updateParams({
      selected: Object.keys(newChecked).map((key) => parseInt(key, 10))
    });
  };

  const handleShare = () => {
    const { href } = window.location;
    const copyString = `${href}`;
    if (window.isSecureContext) {
      navigator.clipboard.writeText(copyString).then(() => {
        toast("Copied to clipboard");
      });
    } else {
      toastError(
        "Unable to copy to clipboard due to lack of HTTPS. Please contact the system administrator about this issue."
      );
    }
  };

  return (
    <SearchLayout
      title={
        configDetails?.name
          ? `Config Details for ${configDetails.name}`
          : "Config Details"
      }
    >
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
                  setChecked({});
                  updateParams({ selected: null });
                }}
              >
                Clear
              </button>
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
                onClick={() => setShowIncidentModal(true)}
              >
                Create Incident
              </button>
            </>
          )}
        </div>
        <div className="flex flex-col w-full border rounded-md">
          {!isLoading ? (
            Object.entries(jsonLines).map(([lineIndex, line]) => (
              <div
                key={lineIndex}
                style={{
                  background: checked[lineIndex] ? "#cfe3ff" : "",
                  borderColor: checked[lineIndex] ? "#cfe3ff" : ""
                }}
                className="flex flex-row"
              >
                <button
                  type="button"
                  onClick={() => handleClick(lineIndex)}
                  className="flex text-xs mr-2 select-none border-r w-12 justify-between pb-px"
                >
                  <span
                    className="w-4 flex items-center justify-center"
                    style={{
                      color: checked[lineIndex] ? "#dd0707" : "#086008"
                    }}
                  >
                    {checked[lineIndex] ? "-" : "+"}
                  </span>
                  <div
                    className="text-xs flex items-center justify-end px-1 text-gray-600"
                    style={{
                      borderColor: checked[lineIndex] ? "#cfe3ff" : ""
                    }}
                  >
                    {lineIndex}
                  </div>
                </button>

                <code className="whitespace-pre-wrap text-xs text-gray-800">
                  {line}
                </code>
              </div>
            ))
          ) : (
            <div className="h-32 flex items-center justify-center">
              <Loading />
            </div>
          )}
        </div>
        <Modal
          open={showIncidentModal}
          onClose={() => setShowIncidentModal(false)}
          size="small"
          title="Create New Incident from Selected Evidence"
        >
          <IncidentCreate
            callback={(response) => {
              navigate(`/incidents/${response.id}`, { replace: true });
            }}
            evidence={{
              configId: id,
              configName: configDetails?.name,
              config: jsonLines,
              type: "config",
              lines: Object.keys(checked).reduce((acc, lineNum) => {
                acc[lineNum] = jsonLines[lineNum];
                return acc;
              }, {})
            }}
          />
        </Modal>
      </div>
    </SearchLayout>
  );
}
