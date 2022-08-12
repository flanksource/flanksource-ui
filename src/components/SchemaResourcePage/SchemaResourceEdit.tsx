import clsx from "clsx";
import { identity, pickBy } from "lodash";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { v4 } from "uuid";

import { SchemaResourceI } from "../../api/schemaResources";
import { CodeEditor } from "../CodeEditor";
import { IconPicker } from "../IconPicker";
import { TextInput } from "../TextInput";
import { Icon } from "../Icon";

type FormFields = Partial<
  Pick<SchemaResourceI, "id" | "spec" | "name" | "source" | "icon">
>;

type Props = FormFields & {
  onSubmit: (val: Partial<SchemaResourceI>) => Promise<void>;
  onDelete?: (id: string) => void;
  onCancel?: () => void;
  resourceName: string;
  edit?: boolean;
  isModal?: boolean;
  supportsIcon?: boolean;
};

export function SchemaResourceEdit({
  resourceName,
  id,
  spec,
  name,
  icon = "group",
  source,
  onSubmit,
  onDelete,
  onCancel,
  edit: startInEdit = false,
  isModal = false,
  supportsIcon = false
}: Props) {
  const [edit, setEdit] = useState(startInEdit);
  const [disabled, setDisabled] = useState(false);
  const keyRef = useRef(v4());

  const defaultValues = pickBy({ id, spec, name }, identity);
  if (supportsIcon) {
    defaultValues.icon = icon;
  }

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    resetField,
    watch
  } = useForm<FormFields>({
    defaultValues
  });

  const values = getValues();
  if (supportsIcon) {
    watch("icon");
  }
  watch("spec");

  useEffect(() => {
    register("spec");
    register("name");
  }, [register]);

  const onEdit = () => setEdit(true);
  const doCancel = () => {
    onCancel && onCancel();
    resetField("name");
    resetField("spec");
    if (supportsIcon) {
      resetField("icon");
    }
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
      <div className="px-8 pt-4">
        {!source && edit ? (
          <>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => {
                return (
                  <TextInput
                    label={`${resourceName} name`}
                    placeholder={`${resourceName} name`}
                    id="name"
                    disabled={disabled}
                    className="w-full"
                    value={value || ""}
                    onChange={onChange}
                  />
                );
              }}
            />

            {supportsIcon && (
              <div className="space-y-2">
                <label
                  htmlFor="icon-picker"
                  className="block text-sm font-bold text-gray-700 pt-4"
                >
                  Icon
                </label>

                <IconPicker
                  icon={values.icon}
                  onChange={(v) => setValue("icon", v.value)}
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-between">
            <h2 className="text-dark-gray font-bold mr-3 text-xl flex items-center space-x-2">
              {supportsIcon && <Icon size="md" name={icon} />}
              <span>{name}</span>
            </h2>
            {!!source && (
              <div className="px-2">
                <a href={`${source}`}>Config source</a>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-8 space-y-2">
        <label
          htmlFor="icon-picker"
          className="block text-sm font-bold text-gray-700"
        >
          Spec
        </label>

        <div className="h-[min(850px,calc(100vh-400px))]">
          <CodeEditor
            key={keyRef.current}
            readOnly={!!source || disabled || !edit}
            value={values.spec ? JSON.stringify(values.spec, null, 2) : null}
            onChange={(v) => setValue("spec", v ? JSON.parse(v) : null)}
          />
        </div>
      </div>
      {!source && (
        <div
          className={clsx(
            "flex justify-between px-10 rounded-b py-4 space-x-2",
            {
              "bg-gray-100": isModal
            }
          )}
        >
          {!!id && (
            <button
              className="inline-flex items-center justify-center border-none shadow-sm font-medium rounded-md text-red-500 bg-red-100 hover:bg-red-200 focus:ring-offset-white focus:ring-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 text-sm leading-5"
              disabled={disabled}
              onClick={doDelete}
            >
              Delete
            </button>
          )}

          {edit ? (
            <div className="w-full flex justify-between">
              <button
                className="btn-secondary-base btn-secondary"
                disabled={disabled}
                onClick={doCancel}
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
