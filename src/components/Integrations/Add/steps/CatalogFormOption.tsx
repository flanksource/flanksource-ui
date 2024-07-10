import { useSettingsCreateResource } from "@flanksource-ui/api/query-hooks/mutations/useSettingsResourcesMutations";
import { schemaResourceTypes } from "@flanksource-ui/components/SchemaResourcePage/resourceTypes";
import ConfigScrapperSpecEditor from "@flanksource-ui/components/SpecEditor/ConfigScrapperSpecEditor";
import { SpecEditorProps } from "@flanksource-ui/components/SpecEditor/SpecEditor";

type Props = Pick<SpecEditorProps, "onTypeSelected" | "onBack"> & {
  onSuccess: () => void;
};

export default function CatalogFormOption({ onSuccess, ...props }: Props) {
  const resourceInfo = schemaResourceTypes.find(
    (resource) => resource.name === "Catalog Scraper"
  );

  const { mutate: createResource } = useSettingsCreateResource(
    resourceInfo!,
    onSuccess
  );

  return (
    <div className="flex flex-col gap-2 overflow-y-auto h-full">
      <ConfigScrapperSpecEditor onSubmit={createResource} footer={false} {...props} />
    </div>
  );
}
