import { FaExclamationTriangle } from "react-icons/fa";

export default function EmptyState({
  header = null,
  title = "No details found"
}: {
  header?: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="flex flex-row items-center justify-center py-4 text-gray-400">
      <div className="flex flex-col">
        {header}
        <div className="flex flex-row items-center space-x-2 text-base">
          <FaExclamationTriangle className="text-xl" />
          <span>{title}</span>
        </div>
      </div>
    </div>
  );
}
