import { useMemo } from "react";
import { FaCog } from "react-icons/fa";
import AWSConfigsFormEditor from "../Forms/Configs/AWSConfigsFormEditor";
import AzureConfigsFormEditor from "../Forms/Configs/AzureConfigsFormEditor";
import AzureDevopsConfigsFormEditor from "../Forms/Configs/AzureDevopsConfigsFormEditor";
import FileConfigsFormEditor from "../Forms/Configs/FileConfigsFormEditor";
import GithubActionsConfigsFormEditor from "../Forms/Configs/GithubActionsConfigsFormEditor";
import HttpConfigsFormEditor from "../Forms/Configs/HttpConfigsFormEditor";
import KubernetesConfigsFormEditor from "../Forms/Configs/KubernetesConfigsFormEditor";
import KubernetesFileConfigsFormEditor from "../Forms/Configs/KubernetesFileConfigsFormEditor";
import SQLConfigsFormEditor from "../Forms/Configs/SQLConfigsFormEditor";
import TrivyConfigsFormEditor from "../Forms/Configs/TrivyConfigsFormEditor";
import { SchemaResourceType } from "../SchemaResourcePage/resourceTypes";
import SpecEditor from "./SpecEditor";
import scraperTypes from "./ScraperTypes";

const resourceInfo: Pick<SchemaResourceType, "api" | "table" | "name"> = {
  name: "Catalog Scraper",
  api: "config-db",
  table: "config_scrapers"
};

type ConfigScrapperSpecEditorProps = {
  resourceValue?: Record<string, any>;
  onSubmit?: (spec: Record<string, any>) => void;
  onBack?: () => void;
  onDeleted?: () => void;
};

export default function ConfigScrapperSpecEditor({
  resourceValue,
  onSubmit = () => {},
  onBack,
  onDeleted = () => {}
}: ConfigScrapperSpecEditorProps) {
  const configTypes = scraperTypes(onSubmit, resourceValue);

  // there should only be one spec, so we can just grab the first key that isn't
  // schedule, otherwise we'll just use custom
  const selectedSpec = resourceValue?.spec
    ? Object.keys(resourceValue?.spec).filter(
        (key) => key !== "schedule" && key !== "retention"
      )[0] ?? "custom"
    : undefined;

  return (
    <SpecEditor
      types={configTypes}
      format="yaml"
      resourceInfo={resourceInfo}
      selectedSpec={selectedSpec}
      onBack={onBack}
      onDeleted={onDeleted}
    />
  );
}
