import { Controller, useForm } from "react-hook-form";
import { CodeEditor } from "../CodeEditor";
import { useEffect, useState, useRef } from "react";
import { TextInput } from "../TextInput";
import { SchemaResourceI } from "src/api/schemaResources";
import { identity, pickBy } from "lodash";
import { v4 } from "uuid";

type FormFields = Partial<
  Pick<SchemaResourceI, "id" | "spec" | "name" | "source">
>;

type Props = FormFields & {
  onSubmit: (val: Partial<SchemaResourceI>) => Promise<void>;
  onDelete?: (id: string) => void;
  edit: boolean;
};

export function SchemaResourceEdit({
  id,
  spec,
  name,
  source,
  onSubmit,
  onDelete,
  edit: startInEdit
}: Props) {
  const [edit, setEdit] = useState(startInEdit || false);
  const [disabled, setDisabled] = useState(false);
  const keyRef = useRef(v4());

  const { control, register, handleSubmit, setValue, getValues, resetField } =
    useForm<FormFields>({
      defaultValues: pickBy({ id, spec, name }, identity)
    });

  const values = getValues();

  useEffect(() => {
    register("spec");
    register("name");
  }, [register]);

  const onEdit = () => setEdit(true);
  const onCancel = () => {
    resetField("name");
    resetField("spec");
    setEdit(false);
    keyRef.current = v4();
  };

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
        {!source && edit ? (
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

        {!!source && (
          <div className="px-2">
            <a href={`${source}`}>Config source</a>
          </div>
        )}
      </div>
      <div className="h-[calc(100vh-300px)]">
        <CodeEditor
          key={keyRef.current}
          readOnly={!!source || disabled || !edit}
          value={values.spec ? JSON.stringify(values.spec, null, 2) : null}
          onChange={(v) => setValue("spec", v ? JSON.parse(v) : null)}
        />
      </div>
      {!source && (
        <div className="flex justify-between">
          {!!id && (
            <button
              className="btn-secondary-base btn-secondary"
              disabled={disabled}
              onClick={doDelete}
            >
              Delete
            </button>
          )}

          {edit ? (
            <div className="space-x-2">
              <button
                className="btn-secondary-base btn-secondary"
                disabled={disabled}
                onClick={onCancel}
              >
                Cancel
              </button>
              <input
                disabled={disabled}
                className="btn-primary"
                type="submit"
                value="Save"
              />
            </div>
          ) : (
            !!id && (
              <button
                className="btn-primary"
                disabled={disabled}
                onClick={onEdit}
              >
                Edit
              </button>
            )
          )}
        </div>
      )}
    </form>
  );
}
