import { useNavigate, useParams } from "react-router-dom";
import { SearchLayout } from "../../components/Layout";
import jsonString from "../../data/sampleConfig.json";

const mockName = "package.json"; // TODO: get actual name from API call

export function ConfigDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <SearchLayout title={`Config Details for ${mockName}`}>
      <div className="flex flex-col items-start">
        <button
          className="border rounded-md px-3 py-1 text-sm"
          type="button"
          onClick={() => navigate("/config")}
        >
          Back
        </button>
        <textarea
          readOnly
          className="w-full text-xs mt-2 rounded-md border-gray-300"
          contentEditable={false}
          style={{ minHeight: "700px", fontFamily: "monospace" }}
          value={JSON.stringify(jsonString, undefined, 4)}
        />
      </div>
    </SearchLayout>
  );
}
