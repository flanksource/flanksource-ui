import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllIncidentByCurrentUser } from "../../../api/services/incident";

export function IncidentListPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    getAllIncidentByCurrentUser().then((res) => {
      setIncidents(res.data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col justify-center">
      <div className="mt-4 w-full px-4">
        <h1 className="pb-4 text-xl font-semibold">Incident List</h1>
        <div>
          {!isLoading ? (
            <IncidentList list={incidents || []} />
          ) : (
            <div>fetching incidents...</div>
          )}
        </div>
      </div>
    </div>
  );
}

function IncidentList({ list, ...rest }) {
  return (
    <div className="border border-gray-300">
      {list.map((incident) => {
        const { title, id, description, severity, status, type } = incident;
        return (
          <Link to={`/incident/${id}`} key={id}>
            <div className="border-b last:border-b-0 px-6 py-3">
              <div className="text-gray-800 font-semibold">{title}</div>
              <div className="text-gray-400 text-sm">
                description: {description}
              </div>
              <div className="text-gray-400 text-sm">id: {id}</div>
              <div className="text-gray-400 text-sm">severity: {severity}</div>
              <div className="text-gray-400 text-sm">status: {status}</div>
              <div className="text-gray-400 text-sm">type: {type}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
