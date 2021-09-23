import { useState } from "react";
import { JsonForm } from "../../components";
import schema from "../../data/formSchemaSample.json";

export function JsonFormPage() {
  const [useTailwind, setUseTailwind] = useState(false);
  return (
    <div className="max-w-screen-xl mx-auto flex flex-col justify-center px-3">
      <div className="flex flex-row items-center">
        <input
          type="checkbox"
          value={useTailwind}
          onChange={(e) => setUseTailwind(e.target.checked)}
        />
        <span>use tailwind theme</span>
      </div>

      <div className="py-16">
        <JsonForm schema={schema} theme={useTailwind ? "tailwind" : null} />
      </div>
    </div>
  );
}
