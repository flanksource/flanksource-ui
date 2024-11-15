import { useState } from "react";
import { Tab, Tabs } from "../Tabs/Tabs";
import CLIInstallAgent from "./CLISnippet";
import FluxSnippet from "./FluxSnippet";

export function WarningBox() {
  return (
    <div
      className="relative rounded border border-yellow-200 bg-yellow-100 px-4 py-3 text-yellow-700"
      role="alert"
    >
      <span className="block sm:inline">
        Access token will be shown only once. Please copy it and store it
        securely.
      </span>
    </div>
  );
}

export type ChartData = {
  namespace?: string;
  createNamespace?: boolean;
  chart?: string;
  chartUrl?: string;
  repoName?: string;
  releaseName: string;
  values?: Record<string, any>;
  args?: string[];
  createRepo?: boolean;
  wait?: boolean;
  valueFile?: string;
  updateHelmRepo?: boolean;
};

type HelmInstallationSnippetsProps = {
  charts: ChartData[];
  isWarningDisplayed?: boolean;
};

export default function HelmInstallationSnippets({
  charts,
  isWarningDisplayed = false
}: HelmInstallationSnippetsProps) {
  const [activeTab, setActiveTab] = useState<"flux" | "cli">("flux");

  return (
    <Tabs activeTab={activeTab} onSelectTab={(v) => setActiveTab(v as any)}>
      <Tab className="flex flex-col gap-4 p-4" label="Flux" value="flux">
        <FluxSnippet data={charts} />
        {isWarningDisplayed && <WarningBox />}
      </Tab>
      <Tab className="flex flex-col gap-4 p-4" label="Helm CLI" value="cli">
        <CLIInstallAgent data={charts} />
        {isWarningDisplayed && <WarningBox />}
      </Tab>
    </Tabs>
  );
}
