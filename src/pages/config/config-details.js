import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
import {
  decodeUrlSearchParams,
  updateParams
} from "../../components/Canary/url";
import { SearchLayout } from "../../components/Layout";
import { toastError } from "../../components/Toast/toast";
import { Modal } from "../../components/Modal";
import { IncidentCreate } from "../../components/Incidents/IncidentCreate";
import { getConfig, getConfigChange } from "../../api/services/configs";
import { Loading } from "../../components/Loading";
import { ConfigChangeHistory } from "../../components/ConfigChangeHistory";
import { JSONViewer } from "../../components/JSONViewer";

export function ConfigDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [checked, setChecked] = useState({});
  const [configDetails, setConfigDetails] = useState();
  const [jsonLines, setJsonLines] = useState([]);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    getConfig(id)
      .then((res) => {
        setConfigDetails(res?.data[0]);
      })
      .catch((err) => toastError(err))
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    let json = configDetails?.config;
    if (json) {
      if (typeof json !== "string") {
        json = JSON.stringify(json, null, 2);
      }
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

  const onTabChange = (index) => {
    if (index === 1) {
      setIsLoading(true);
      getConfigChange(id)
        .then((res) => {
          if (res.data.length === 0) {
            setHistoryData([]);
          } else {
            setHistoryData(res?.data);
          }
        })
        .catch((err) => toastError(err))
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const code =
    configDetails?.config && JSON.stringify(configDetails.config, null, 2);

  const tabs = [
    {
      text: "Config",
      panel: (
        <div className="flex flex-col w-full border rounded-md rounded-tl-none">
          {!isLoading ? (
            <JSONViewer
              code={code}
              showLineNo
              onClick={handleClick}
              selections={checked}
            />
          ) : (
            <div className="h-32 flex items-center justify-center">
              <Loading />
            </div>
          )}
        </div>
      )
    },
    {
      text: "Changes",
      panel: <ConfigChangeHistory data={historyData} isLoading={isLoading} />
    }
  ];

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
        {/* Tabs */}
        <Tab.Group onChange={onTabChange}>
          <Tab.List className=" flex space-x-1 border-gray-300">
            {tabs.map((tab) => (
              <Tab
                key={tab.text}
                className={({ selected }) =>
                  clsx(
                    "rounded-t-md py-2.5 px-4 text-sm leading-5",
                    "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400",
                    selected ? "border border-b-0 border-gray-300" : ""
                  )
                }
              >
                {tab.text}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="">
            {tabs.map((tab) => (
              <Tab.Panel
                key={tab.text}
                className={clsx(
                  "rounded-xl bg-white",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400"
                )}
              >
                {tab.panel}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
        {/* Modal */}
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
