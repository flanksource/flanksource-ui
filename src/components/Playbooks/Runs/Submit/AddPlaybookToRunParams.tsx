import { useMemo } from "react";
import FormikTextInput from "../../../Forms/Formik/FormikTextInput";
import { PlaybookSpec } from "../../Settings/PlaybookSpecsTable";

type AddPlaybookToRunParamsProps = {
  playbookSpec: PlaybookSpec;
};

export default function AddPlaybookToRunParams({
  playbookSpec
}: AddPlaybookToRunParamsProps) {
  const playbookParams = useMemo(
    () =>
      (playbookSpec.spec.parameters as { name: string; label: string }[]) ?? [],
    [playbookSpec]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="font-bold">Params</div>
      <div className="flex flex-col gap-2">
        {playbookParams.length > 0 ? (
          playbookParams.map(({ name, label }) => (
            <FormikTextInput
              name={`params.${name}`}
              label={label}
              key={`${label}-${name}`}
            />
          ))
        ) : (
          <div className="text-gray-400">No parameters for this playbook.</div>
        )}
      </div>
    </div>
  );
}
