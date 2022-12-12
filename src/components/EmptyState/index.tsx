import { FaExclamationTriangle } from "react-icons/fa";

export default function EmptyState({ title = "No details found" }) {
  return (
    <div className="flex flex-row justify-center items-center py-4 space-x-4 text-gray-400">
      <FaExclamationTriangle className="text-xl" />
      <span>{title}</span>
    </div>
  );
}
