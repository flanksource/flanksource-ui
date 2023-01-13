import { FaExclamationTriangle } from "react-icons/fa";

export default function EmptyState({
  header = null,
  title = "No details found"
}: {
  header?: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="flex flex-row justify-center items-center py-4 text-gray-400">
      <div className="flex flex-col">
        {header}
        <div className="flex flex-row space-x-4 text-base">
          <FaExclamationTriangle className="text-xl" />
          <span>{title}</span>
        </div>
      </div>
    </div>
  );
}
