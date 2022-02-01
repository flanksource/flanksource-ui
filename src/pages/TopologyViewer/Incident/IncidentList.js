import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@headlessui/react";
import cx from "clsx";
import { getAllIncident } from "../../../api/services/incident";
import { IncidentCreate } from "../../../components/Incidents/IncidentCreate";
import { IncidentList } from "../../../components/Incidents/IncidentList";
import { Modal } from "../../../components/Modal";

export function IncidentListPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [incidents, setIncidents] = useState([]);
  const [incidentModalIsOpen, setIncidentModalIsOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const loadIncidents = () => {
    setIsLoading(true);
    getAllIncident().then((res) => {
      setIncidents(res.data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col justify-center">
      <div className="mt-4 w-full px-4">
        <div className="flex justify-between items-center pb-4">
          <button
            type="button"
            onClick={() => setIncidentModalIsOpen(true)}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-dark-blue hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Incident
          </button>
          <div className="flex">
            <h1 className="text-sm font-inter mr-3.5">Show as table</h1>
            <Switch
              checked={enabled}
              onChange={setEnabled}
              className={cx(
                "relative inline-flex h-6 w-11 rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none",
                enabled ? "bg-dark-blue" : "bg-gray-200"
              )}
            >
              <span className="sr-only">Use setting</span>
              <span
                className={cx(
                  "absolute pointer-events-none inline-block w-4 h-4 transform transition bg-white rounded-full ease-in-out duration-200 top-1",
                  enabled ? "translate-x-6" : "translate-x-1"
                )}
              />
            </Switch>
          </div>
        </div>
        <div className="pb-12">
          {!isLoading ? (
            <IncidentList list={incidents || []} />
          ) : (
            <div>fetching incidents...</div>
          )}
        </div>
      </div>

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
        <IncidentCreate
          callback={(response) => {
            navigate(`/incidents/${response.id}`, { replace: true });
          }}
        />
      </Modal>
    </div>
  );
}
