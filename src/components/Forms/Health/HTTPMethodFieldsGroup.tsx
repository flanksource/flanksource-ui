import { useState } from "react";
import { Switch } from "../../Switch";
import { FormikCodeEditor } from "../Formik/FormikCodeEditor";
import { useField, useFormikContext } from "formik";

const MethodOptions = ["GET", "POST", "PUT", "DELETE"] as const;

type HTTPBodyProps = {
  method: typeof MethodOptions[number];
  name: string;
};

function HTTPBody({ method, name }: HTTPBodyProps) {
  const [selectedBodyType, setSelectedBodyType] = useState<
    "Text" | "Go Template"
  >("Text");

  if (method === "GET" || method === "DELETE") return null;

  return (
    <div className="flex flex-col space-y-2">
      <label className="font-semibold">Body</label>
      <Switch
        options={["Text", "Go Template"]}
        defaultValue="Text"
        onChange={(v) => setSelectedBodyType(v as any)}
      />

      {selectedBodyType && (
        <FormikCodeEditor
          fieldName={name}
          className="h-32"
          format={selectedBodyType === "Go Template" ? "go" : "text"}
        />
      )}
    </div>
  );
}

type HTTPMethodsFieldGroupProps = {
  methodFieldName: string;
  bodyFieldName: string;
};

export default function HTTPMethodFieldsGroup({
  bodyFieldName,
  methodFieldName
}: HTTPMethodsFieldGroupProps) {
  const [field] = useField(methodFieldName);

  const [selectedMethod, setSelectedMethod] = useState<
    typeof MethodOptions[number]
  >(field.value ?? "GET");

  const { setFieldValue } = useFormikContext<Record<string, any>>();

  return (
    <div className="flex flex-col space-y-2">
      <label className="font-semibold text-sm">HTTP Method</label>
      <Switch
        options={MethodOptions.map((value) => value)}
        defaultValue="GET"
        value={selectedMethod}
        onChange={(v) => {
          setSelectedMethod(v as any);
          setFieldValue(methodFieldName, v);
        }}
      />
      {selectedMethod && (
        <HTTPBody method={selectedMethod} name={bodyFieldName} />
      )}
    </div>
  );
}
