import React, { useState } from "react";
// import { getLogs } from "../../api/services/logs";
import { Modal } from "../Modal";
import { Loading } from "../Loading";
import { LogsIncidentLinker } from "./LogsIncidentLinker";
import { LogsTable } from "./Table/logs-table";

export function LogsViewer({ logs, isLoading }) {
  const [selectedList, setSelectedList] = useState([]);
  const [incidentModalIsOpen, setIncidentModalIsOpen] = useState(false);

  return (
    <>
      {isLoading ? (
        <Loading text="Loading logs..." />
      ) : (
        <LogsTable
          logs={logs}
          actions={[
            {
              label: "Link to Incident",
              handler: (selected) => {
                setSelectedList(selected);
                setIncidentModalIsOpen(true);
              }
            }
          ]}
        />
      )}
      <Modal
        open={incidentModalIsOpen}
        onClose={() => setIncidentModalIsOpen(false)}
        cardClass="w-full"
        contentClass="h-full px-8"
        cardStyle={{
          maxWidth: "420px",
          maxHeight: "calc(100vh - 4rem)"
        }}
        closeButtonStyle={{
          padding: "2.2rem 2.1rem 0 0"
        }}
        hideActions
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
}
