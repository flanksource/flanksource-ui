import { FormikCodeEditor } from "./FormikCodeEditor";

type Props = {
  name: string;
};

export default function FormikNotificationsTemplateField({ name }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className={`block text-sm font-bold text-gray-700`}>
        Markdown Template
      </label>
      <FormikCodeEditor
        className="flex flex-col h-[200px]"
        fieldName={name}
        format={"markdown"}
      />
    </div>
  );
}
