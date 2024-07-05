import {
  SearchResourcesRequest,
  searchResources
} from "@flanksource-ui/api/services/search";
import { PlaybookResourceSelector } from "@flanksource-ui/api/types/playbooks";
import { ConfigIcon } from "@flanksource-ui/ui/Icons/ConfigIcon";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { useQuery } from "@tanstack/react-query";
import FormikSelectDropdown, {
  FormikSelectDropdownOption
} from "./FormikSelectDropdown";

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
    select: (data) => {
      if (data?.checks) {
        return data.checks.map(
          (check) =>
            ({
              icon: (
                <Icon
                  className="h-4 w-5"
                  name={check.icon}
                  secondary={check.name}
                />
              ),
              value: check.id,
              label: check.name
            } satisfies FormikSelectDropdownOption)
        );
      }
      if (data?.components) {
        return data.components.map(
          (component) =>
            ({
              icon: (
                <Icon
                  className="h-4 w-5"
                  name={component.icon}
                  secondary={component.name}
                />
              ),
              value: component.id,
              label: component.name
            } satisfies FormikSelectDropdownOption)
        );
      }
      if (data?.configs) {
        return data.configs.map(
          (config) =>
            ({
              id: config.id,
              icon: <ConfigIcon config={config} />,
              description: config.name,
              value: config.id,
              label: config.name
            } satisfies StateOption)
        );
      }
    },
    staleTime: 0,
    cacheTime: 0
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
