import { useState } from "react";
import { Tab, Tabs } from "../Tabs/Tabs";
import CLIInstallAgent from "./CLIInstallAgent";
import FluxInstallAgent from "./FluxInstallAgent";

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

export type TemplateContextData = {
  namespace?: string;
  createNamespace?: boolean;
  chart?: string;
  repoName?: string;
  values?: {
    key: string;
    value?: string;
  }[];
  args?: string[];
  kubeValues?: {
    key: string;
    value?: string;
  }[];
  createRepo?: boolean;
  wait?: boolean;
  valueFile?: string;
};

type HelmInstallationSnippetsProps = {
  templateData: TemplateContextData;
  isWarningDisplayed?: boolean;
};

export default function HelmInstallationSnippets({
  templateData,
  isWarningDisplayed = false
}: HelmInstallationSnippetsProps) {
  const [activeTab, setActiveTab] = useState<"flux" | "cli">("flux");

  return (
    <Tabs activeTab={activeTab} onSelectTab={(v) => setActiveTab(v as any)}>
      <Tab className="flex flex-col gap-4 p-4" label="Flux" value="flux">
        <FluxInstallAgent data={templateData} />
        {isWarningDisplayed && <WarningBox />}
      </Tab>
      <Tab className="flex flex-col gap-4 p-4" label="Helm CLI" value="cli">
        <CLIInstallAgent data={templateData} />
        {isWarningDisplayed && <WarningBox />}
      </Tab>
    </Tabs>
  );
}
