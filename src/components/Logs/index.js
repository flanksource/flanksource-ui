import React, { useState, useMemo } from "react";
// import { getLogs } from "../../api/services/logs";
import { Modal } from "../Modal";
import { Loading } from "../Loading";
import { LogsIncidentLinker } from "./LogsIncidentLinker";
import { LogsTable } from "./Table/logs-table";
import { LoadingStates } from "../../constants";

export const LogsViewer = React.memo(function LogsViewer({ logs, loadingState }) {
  const [selectedList, setSelectedList] = useState([]);
  const [incidentModalIsOpen, setIncidentModalIsOpen] = useState(false);
  const [variant, setVariant] = useState("comfortable");

  const actions = useMemo(
    () => [
      {
        label: "Link to Incident",
        handler: (selected) => {
          setSelectedList(selected);
          setIncidentModalIsOpen(true);
        }
      }
    ],
    []
  );

  if (loadingState === LoadingStates.idle) {
    return null;
  }

  return (
    <>
      {loadingState === LoadingStates.loading ? (
        <Loading text="Loading logs..." />
      ) : (
        <>
          <div
            className="inline-flex shadow-md hover:shadow-lg focus:shadow-lg mb-4"
            role="group"
          >
            <button
              type="button"
              className="btn-primary rounded-r-none"
              onClick={() => setVariant("comfortable")}
            >
              Comfortable
            </button>
            <button
              type="button"
              className="btn-primary rounded-l-none"
              onClick={() => setVariant("compact")}
            >
              Compact
            </button>
          </div>
          <LogsTable
            logs={logs}
            variant={variant}
            actions={variant === "comfortable" ? actions : undefined}
          />
        </>
      )}
      <Modal
        open={incidentModalIsOpen}
        onClose={() => setIncidentModalIsOpen(false)}
        size="small"
      >
        <LogsIncidentLinker
          selectedLogs={selectedList}
          callback={(success) => {
            if (success) {
              setSelectedList([]);
            }
            setIncidentModalIsOpen(false);
          }}
        />
      </Modal>
    </>
  );
});

LogsViewer.displayName = "LogsViewer";
