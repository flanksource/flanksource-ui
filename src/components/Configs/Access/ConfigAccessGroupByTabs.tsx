import {
  Tabs,
  TabsList,
  TabsTrigger
} from "@flanksource-ui/components/ui/tabs";
import { CatalogAccessMode } from "@flanksource-ui/hooks/useCatalogAccessUrlState";

const groupedModes = ["group-config", "group-user"] as const;
type GroupedCatalogAccessMode = (typeof groupedModes)[number];

type ConfigAccessGroupByTabsProps = {
  mode: CatalogAccessMode;
  onChange: (mode: GroupedCatalogAccessMode) => void;
};

export function ConfigAccessGroupByTabs({
  mode,
  onChange
}: ConfigAccessGroupByTabsProps) {
  const selectedMode = groupedModes.includes(mode as GroupedCatalogAccessMode)
    ? (mode as GroupedCatalogAccessMode)
    : "group-config";

  return (
    <Tabs
      value={selectedMode}
      onValueChange={(value) => onChange(value as GroupedCatalogAccessMode)}
    >
      <TabsList aria-label="Catalog access views">
        <TabsTrigger value="group-config">Catalogs</TabsTrigger>
        <TabsTrigger value="group-user">Users</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
