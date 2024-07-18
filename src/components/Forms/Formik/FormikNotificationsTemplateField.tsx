import { FormikCodeEditor } from "./FormikCodeEditor";

type Props = {
  name: string;
};

export default function FormikNotificationsTemplateField({ name }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className={`form-label`}>Markdown Template</label>
      <FormikCodeEditor
        className="flex h-[200px] flex-col"
        fieldName={name}
        format={"markdown"}
      />
    </div>
  );
}
