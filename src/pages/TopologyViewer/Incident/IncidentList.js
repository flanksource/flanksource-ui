import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@headlessui/react";
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
              className={`${
                enabled ? "bg-dark-blue" : "bg-gray-200"
              } relative inline-flex items-center h-6 rounded-full w-11 transition ease-in-out duration-400`}
            >
              <span
                className={`${
                  enabled ? "translate-x-6" : "translate-x-1"
                } inline-block w-4 h-4 transform bg-white rounded-full`}
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
