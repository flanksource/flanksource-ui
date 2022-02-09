import { SearchLayout } from "../components/Layout";
import config from "./Examples/config.png";

export function ConfigPage() {
  return (
    <SearchLayout title="Config Viewer">
      <div className="max-w-3xl mx-auto">
        <img alt="traces" src={config} className="pl-50 pr-50 m-w-[400px]" />
      </div>
    </SearchLayout>
  );
}
