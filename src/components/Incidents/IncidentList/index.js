import { Link } from "react-router-dom";

export function IncidentList({ list, ...rest }) {
  return (
    <div className="border border-gray-300" {...rest}>
      {list.map((incident) => (
        <div key={incident.id} className="last:border-b-0 border-b">
          <IncidentItem incident={incident} />
        </div>
      ))}
    </div>
  );
}

function IncidentItem({ incident, ...rest }) {
  const { title, id, description, severity, status, type } = incident;
  return (
    <Link to={`/incident/${id}`} {...rest}>
      <div className="px-6 py-3">
        <div className="text-gray-800 font-semibold">{title}</div>
        <div className="text-gray-400 text-sm">description: {description}</div>
        <div className="text-gray-400 text-sm">id: {id}</div>
        <div className="text-gray-400 text-sm">severity: {severity}</div>
        <div className="text-gray-400 text-sm">status: {status}</div>
        <div className="text-gray-400 text-sm">type: {type}</div>
      </div>
    </Link>
  );
}
