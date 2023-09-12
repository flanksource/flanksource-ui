import { useState } from "react";
import { FormikCodeEditor } from "./FormikCodeEditor";
import { Switch } from "../../Switch";

type Props = {
  name: string;
};

export default function FormikNotificationsTemplateField({ name }: Props) {
  const [templateOption, setTemplateOption] = useState<"Go Template" | "HTML">(
    "Go Template"
  );

  return (
    <div className="flex flex-col gap-2">
      <label className={`block text-sm font-bold text-gray-700`}>
        Template
      </label>
      <div className="flex flex-row w-full">
        <Switch
          itemsClassName="w-auto"
          onChange={(option) =>
            setTemplateOption(option as "Go Template" | "HTML")
          }
          options={["Go Template", "HTML"]}
          value={templateOption}
        />
      </div>
      <FormikCodeEditor
        className="flex flex-col h-[200px]"
        fieldName={name}
        format={templateOption === "Go Template" ? "go" : "html"}
      />
    </div>
  );
}
