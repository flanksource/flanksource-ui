import { useNavigate, useParams } from "react-router-dom";
import { SearchLayout } from "../../components/Layout";
import jsonString from "../../data/sampleConfig.json";

export function ConfigDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <SearchLayout title={`Config Details for ${id}`}>
      <div className="flex flex-col items-start">
        <button
          className="border rounded-md px-4 py-2"
          type="button"
          onClick={() => navigate("/config")}
        >
          Back to list
        </button>
        <textarea
          readOnly
          className="w-full text-sm mt-2"
          contentEditable={false}
          style={{ minHeight: "700px", fontFamily: "monospace" }}
          value={JSON.stringify(jsonString, undefined, 4)}
        />
      </div>
    </SearchLayout>
  );
}
