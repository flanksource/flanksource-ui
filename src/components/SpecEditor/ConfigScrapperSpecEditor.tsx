import { useMemo } from "react";
import { SchemaResourceType } from "../SchemaResourcePage/resourceTypes";
import scraperTypes from "./ScraperTypes";
import SpecEditor, { SpecEditorProps } from "./SpecEditor";

const resourceInfo: Pick<SchemaResourceType, "api" | "table" | "name"> = {
  name: "Catalog Scraper",
  api: "config-db",
  table: "config_scrapers"
};

type ConfigScrapperSpecEditorProps = Omit<
  SpecEditorProps,
  "types" | "resourceInfo"
> & {
  footer?: boolean;
  resourceValue?: Record<string, any>;
  onSubmit?: (spec: Record<string, any>) => void;
};

export default function ConfigScrapperSpecEditor({
  resourceValue,
  footer = true,
  onSubmit = () => {},
  ...props
}: ConfigScrapperSpecEditorProps) {
  const configTypes = useMemo(
    () => scraperTypes(onSubmit, resourceValue),
    [onSubmit, resourceValue]
  );

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
      footer={footer}
      format="yaml"
      resourceInfo={resourceInfo}
      selectedSpec={selectedSpec}
      {...props}
    />
  );
}
