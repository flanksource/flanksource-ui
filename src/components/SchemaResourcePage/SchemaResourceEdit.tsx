import { SchemaResourceI } from "./SchemaResource";
import { Controller, useForm } from "react-hook-form";
import { CodeEditor } from "../CodeEditor";
import { useEffect } from "react";
import { TextInput } from "../TextInput";

export function SchemaResourceEdit({
  id,
  spec,
  name,
  onSubmit
}: Partial<Pick<SchemaResourceI, "id" | "spec" | "name">> & {
  onSubmit: (val: Partial<SchemaResourceI>) => void;
}) {
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    id: id || "",
    spec: spec || "",
    name: name || ""
  });
  const specValue = watch("spec");

  useEffect(() => {
    register("spec");
    register("name");
  }, [register]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => {
          return (
            <TextInput
              label="Name"
              id="name"
              className="w-full"
              value={value}
              onChange={onChange}
            />
          );
        }}
      />
      <CodeEditor value={specValue} onChange={(v) => setValue("spec", v)} />
      <input type="submit" />
    </form>
  );
}
