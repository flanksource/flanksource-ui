import { RunnablePlaybook } from "../../../../api/types/playbooks";
import PlaybookParamsFieldsRenderer from "./PlaybookParamsFieldsRenderer";

export default function PlaybookRunParams({
  playbook
}: {
  playbook: Pick<RunnablePlaybook, "parameters">;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2">
        {playbook.parameters && playbook.parameters.length > 0 ? (
          playbook.parameters.map((i) => (
            <div className="flex flex-row gap-2 items-center" key={i.name}>
              {i.type !== "checkbox" && (
                <div className="w-36">
                  <label
                    htmlFor={`params.${i.name}`}
                    className="form-label mb-0"
                  >
                    {i.label}
                  </label>
                </div>
              )}
              <div className="flex flex-col flex-1">
                <PlaybookParamsFieldsRenderer params={i} key={i.name} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-400 py-6">
            No parameters for this playbook.
          </div>
        )}
      </div>
    </div>
  );
}
