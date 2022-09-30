import { useParams } from "react-router-dom";
import ConfigAnalysis from "../../components/ConfigAnalysis";
import { ConfigDetails } from "../../components/ConfigDetails";

export function ConfigDetailsPage() {
  const { id } = useParams();

  return (
    <div className="flex flex-row space-x-4">
      <div className="flex flex-col flex-1">
        <ConfigDetails />
      </div>
      <div className="flex flex-col w-[25rem] shadow-md border-gray-300 border-l p-1">
        <ConfigAnalysis configID={id!} />
      </div>
    </div>
  );
}
