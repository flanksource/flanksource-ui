import { useSettingsCreateResource } from "@flanksource-ui/api/query-hooks/mutations/useSettingsResourcesMutations";
import { schemaResourceTypes } from "@flanksource-ui/components/SchemaResourcePage/resourceTypes";
import ConfigScrapperSpecEditor from "@flanksource-ui/components/SpecEditor/ConfigScrapperSpecEditor";

type Props = {
  onSuccess: () => void;
  onBack: () => void;
};

export default function CatalogFormOption({ onSuccess, onBack }: Props) {
  const resourceInfo = schemaResourceTypes.find(
    (resource) => resource.name === "Catalog Scraper"
  );

  const { mutate: createResource } = useSettingsCreateResource(
    resourceInfo!,
    onSuccess
  );

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto">
      <ConfigScrapperSpecEditor onSubmit={createResource} onBack={onBack} />
    </div>
  );
}
