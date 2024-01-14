import { RunnablePlaybook } from "../../../../api/types/playbooks";
import { ActionResource } from "../services";
import PlaybookParamsFieldsRenderer from "./PlaybookParamsFieldsRenderer";

export default function PlaybookRunParams({
  playbook,
  resource
}: {
  playbook: Pick<RunnablePlaybook, "parameters">;
  resource?: ActionResource | null;
}) {
  return (
    <div className="flex flex-col my-4">
      {resource && (
        <>
          <div className="flex flex-col gap-2 mb-2">
            <label className="form-label mb-0">Resource</label>
            {resource.link}
          </div>
          <div className="border-b border-gray-200 mb-4 mt-2 " />
        </>
      )}
      <div className="flex flex-col gap-2">
        {playbook.parameters && playbook.parameters.length > 0 ? (
          playbook.parameters.map((i) => (
            <div className="flex flex-row gap-2 items-center" key={i.name}>
              {i.type !== "checkbox" && (
                <div className="w-36">
                  <label className="form-label mb-0">{i.label}</label>
                </div>
              )}
              <div className="flex flex-col flex-1">
                <PlaybookParamsFieldsRenderer params={i} key={i.name} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-400">No parameters for this playbook.</div>
        )}
      </div>
    </div>
  );
}
