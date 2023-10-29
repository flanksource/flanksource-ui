import FormikTextInput from "../../../Forms/Formik/FormikTextInput";
import { RunnablePlaybook } from "../../../../api/types/playbooks";
import { ActionResource } from "../services";

export default function PlaybookRunParams({
  playbook,
  resource
}: {
  playbook: RunnablePlaybook;
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
        {playbook.parameters.length > 0 ? (
          playbook.parameters.map((i) => (
            <FormikTextInput
              name={`params.${i.name}`}
              label={i.label}
              key={i.name}
            />
          ))
        ) : (
          <div className="text-gray-400">No parameters for this playbook.</div>
        )}
      </div>
    </div>
  );
}
