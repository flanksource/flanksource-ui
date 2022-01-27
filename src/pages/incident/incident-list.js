import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllIncident } from "../../../api/services/incident";
import { IncidentCreate } from "../../../components/Incidents/IncidentCreate";
import { IncidentList } from "../../../components/Incidents/IncidentList";
import { Modal } from "../../../components/Modal";

export function IncidentListPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [incidents, setIncidents] = useState([]);
  const [incidentModalIsOpen, setIncidentModalIsOpen] = useState(false);

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
          <h1 className="text-xl font-semibold">Incident List</h1>
          <button
            type="button"
            onClick={() => setIncidentModalIsOpen(true)}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Incident
          </button>
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
