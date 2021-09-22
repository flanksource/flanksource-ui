import { JsonForm } from "../../components";
import schema from "../../data/formSchemaSample.json";

export function JsonFormPage() {
  return (
    <div className="max-w-screen-xl mx-auto flex justify-center px-3">
      <JsonForm schema={schema} />
    </div>
  );
}
