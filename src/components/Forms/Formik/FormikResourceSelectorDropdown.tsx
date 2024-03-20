import {
  SearchResourcesRequest,
  searchResources
} from "@flanksource-ui/api/services/search";
import { PlaybookResourceSelector } from "@flanksource-ui/api/types/playbooks";
import { StateOption } from "@flanksource-ui/components/ReactSelectDropdown";
import { useQuery } from "@tanstack/react-query";
import FormikSelectDropdown from "./FormikSelectDropdown";

type FormikConfigsDropdownProps = {
  name: string;
  label?: string;
  required?: boolean;
  hint?: string;
  configResourceSelector?: PlaybookResourceSelector[];
  componentResourceSelector?: PlaybookResourceSelector[];
  checkResourceSelector?: PlaybookResourceSelector[];
  className?: string;
};

export default function FormikResourceSelectorDropdown({
  name,
  label,
  required = false,
  hint,
  configResourceSelector,
  componentResourceSelector,
  checkResourceSelector,
  className = "flex flex-col space-y-2 py-2"
}: FormikConfigsDropdownProps) {
  const resourceSelector: SearchResourcesRequest = {
    checks: checkResourceSelector,
    components: componentResourceSelector,
    configs: configResourceSelector
  };

  const { data: resourcesOptions = [], isLoading } = useQuery({
    queryKey: ["searchResources", resourceSelector],
    queryFn: () => searchResources(resourceSelector),
    enabled:
      configResourceSelector !== undefined ||
      componentResourceSelector !== undefined ||
      checkResourceSelector !== undefined,
    select: (data) =>
      data.map(
        (resource) =>
          ({
            id: resource.id,
            icon: resource.icon,
            description: resource.name,
            value: resource.id,
            label: resource.name
          } satisfies StateOption)
      )
  });

  return (
    <FormikSelectDropdown
      name={name}
      className={className}
      options={resourcesOptions}
      label={label}
      isLoading={isLoading}
      required={required}
      hint={hint}
    />
  );
}
