import { Controller, useForm } from "react-hook-form";
import { CodeEditor } from "../CodeEditor";
import { useEffect, useState } from "react";
import { TextInput } from "../TextInput";
import { Button } from "../Button";
import { SchemaResourceI } from "src/api/schemaResources";
import { identity, pickBy } from "lodash";

type FormFields = Partial<Pick<SchemaResourceI, "id" | "spec" | "name">>;

type Props = FormFields & {
  onSubmit: (val: Partial<SchemaResourceI>) => Promise<void>;
  onDelete?: (id: string) => void;
  edit: boolean;
};

export function SchemaResourceEdit({
  id,
  spec,
  name,
  onSubmit,
  onDelete,
  edit: startInEdit
}: Props) {
  const [edit, setEdit] = useState(startInEdit);
  const [disabled, setDisabled] = useState(false);

  const { control, register, handleSubmit, setValue, getValues } =
    useForm<FormFields>({
      defaultValues: pickBy({ id, spec, name }, identity)
    });

  const values = getValues();

  useEffect(() => {
    register("spec");
    register("name");
  }, [register]);

  const onEdit = () => setEdit((edit) => !edit);
  const doSubmit = (props: any) => {
    onSubmit(props).then(() => setEdit(false));
  };
  const doDelete = () => {
    if (!id) {
      console.error("Called delete for resource without id");
      return;
    }
    if (!onDelete) {
      console.error("onDelete called without being passed to the component.");
      return;
    }
    setDisabled(true);
    onDelete(id);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(doSubmit)}>
      <div className="flex justify-between space-x-8">
        {edit ? (
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => {
              return (
                <TextInput
                  label=""
                  placeholder="Team name"
                  id="name"
                  disabled={disabled}
                  className="w-full"
                  value={value || ""}
                  onChange={onChange}
                />
              );
            }}
          />
        ) : (
          <h2 className="text-dark-gray font-bold mr-3 text-xl">{name}</h2>
        )}
        <div className="space-x-2">
          {edit ? (
            <input
              disabled={disabled}
              className="btn-primary"
              type="submit"
              value="Save"
            />
          ) : (
            !!id && <Button disabled={disabled} text="Edit" onClick={onEdit} />
          )}

          {!!id && (
            <Button disabled={disabled} text="Delete" onClick={doDelete} />
          )}
        </div>
      </div>
      <CodeEditor
        readOnly={disabled && !edit}
        value={JSON.stringify(values.spec || "", null, 2)}
        onChange={(v) => setValue("spec", v || "")}
      />
    </form>
  );
}
