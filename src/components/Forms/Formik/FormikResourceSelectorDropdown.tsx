import {
  searchResources,
  SearchResourcesRequest
} from "@flanksource-ui/api/services/search";
import { PlaybookResourceSelector } from "@flanksource-ui/api/types/playbooks";
import { ConfigIcon } from "@flanksource-ui/ui/Icons/ConfigIcon";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { Tag } from "@flanksource-ui/ui/Tags/Tag";
import { useQuery } from "@tanstack/react-query";
import { useField } from "formik";
import { debounce } from "lodash";
import { useCallback, useMemo, useRef, useState } from "react";
import Select, { components, InputActionMeta } from "react-windowed-select";
import { FormikSelectDropdownOption } from "./FormikSelectDropdown";
import HelpLink from "@flanksource-ui/ui/Buttons/HelpLink";

type FormikConfigsDropdownProps = {
  name: string;
  label?: string;
  required?: boolean;
  hintLink?: boolean;
  configResourceSelector?: PlaybookResourceSelector[];
  componentResourceSelector?: PlaybookResourceSelector[];
  checkResourceSelector?: PlaybookResourceSelector[];
  connectionResourceSelector?: PlaybookResourceSelector[];
  playbookResourceSelector?: PlaybookResourceSelector[];
  className?: string;
};

export default function FormikResourceSelectorDropdown({
  name,
  label,
  required = false,
  hintLink = true,
  configResourceSelector,
  componentResourceSelector,
  checkResourceSelector,
  connectionResourceSelector,
  playbookResourceSelector,
  className = "flex flex-col space-y-2 py-2"
}: FormikConfigsDropdownProps) {
  const [inputText, setInputText] = useState<string>("");
  const [searchText, setSearchText] = useState<string>();
  const [isTouched, setIsTouched] = useState(false);

  const [field, meta] = useField<string | string[]>({
    name,
    type: "text",
    required,
    validate: useCallback(
      (value: string) => {
        if (required && !value) {
          return "This field is required";
        }
      },
      [required]
    )
  });

  const resourceSelector: SearchResourcesRequest = useMemo(
    () => ({
      checks: checkResourceSelector
        ? [
            ...checkResourceSelector.map((r) => ({
              ...r,
              search: searchText,
              agent: r.agent || "all"
            }))
          ]
        : undefined,
      components: componentResourceSelector
        ? [
            ...componentResourceSelector.map((r) => ({
              ...r,
              search: searchText,
              agent: r.agent || "all"
            }))
          ]
        : undefined,
      configs: configResourceSelector
        ? [
            ...configResourceSelector.map((r) => ({
              ...r,
              search: searchText,
              agent: r.agent || "all"
            }))
          ]
        : undefined,
      connections: connectionResourceSelector
        ? [
            ...connectionResourceSelector.map((r) => ({
              ...r,
              search: searchText,
              name: r.name || "*"
            }))
          ]
        : undefined,
      playbooks: playbookResourceSelector
        ? [
            ...playbookResourceSelector.map((r) => ({
              ...r,
              search: searchText,
              name: r.name || "*"
            }))
          ]
        : undefined
    }),
    [
      configResourceSelector,
      componentResourceSelector,
      checkResourceSelector,
      connectionResourceSelector,
      playbookResourceSelector,
      searchText
    ]
  );

  const {
    data: options = [],
    isLoading,
    isRefetching
  } = useQuery({
    queryKey: ["searchResources", resourceSelector],
    queryFn: () => searchResources(resourceSelector),
    enabled:
      configResourceSelector !== undefined ||
      componentResourceSelector !== undefined ||
      checkResourceSelector !== undefined ||
      connectionResourceSelector !== undefined ||
      playbookResourceSelector !== undefined, // || (field.value === undefined && field.value === "" && field.value === null),
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
            }) as FormikSelectDropdownOption
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
            }) as FormikSelectDropdownOption
        );
      }
      if (data?.configs) {
        return data.configs.map((config) => {
          const tags = Object.values(config.tags ?? {}).map((value) => value);

          return {
            icon: <ConfigIcon config={config} />,
            value: config.id,
            search: config.name,
            label: (
              <div className="flex flex-wrap gap-1">
                <span className="mr-2"> {config.name}</span>
                <Tag title="tags">
                  {config.type.split("::").at(-1)?.toLocaleLowerCase()}
                </Tag>
                {tags.map((tag) => (
                  <Tag title={tag} key={tag}>
                    {tag}
                  </Tag>
                ))}
              </div>
            )
          } as FormikSelectDropdownOption;
        });
      }
      if (data?.connections) {
        return data.connections.map((connection) => {
          const tags = Object.values(connection.tags ?? {}).map(
            (value) => value
          );

          return {
            icon: (
              <Icon
                className="h-4 w-5"
                name={connection.icon}
                secondary={connection.name}
              />
            ),
            value: connection.id,
            search: connection.name,
            label: (
              <div className="flex flex-wrap gap-1">
                <span className="mr-2"> {connection.name}</span>
                <Tag title="tags">
                  {connection.type.split("::").at(-1)?.toLocaleLowerCase()}
                </Tag>
                {tags.map((tag) => (
                  <Tag title={tag} key={tag}>
                    {tag}
                  </Tag>
                ))}
              </div>
            )
          } as FormikSelectDropdownOption;
        });
      }
      if (data?.playbooks) {
        return data.playbooks.map((playbook) => {
          return {
            icon: (
              <Icon
                className="h-4 w-5"
                name={playbook.icon}
                secondary={playbook.name}
              />
            ),
            value: playbook.id,
            search: playbook.name,
            label: (
              <div className="flex flex-wrap gap-1">
                <span className="mr-2"> {playbook.name}</span>
              </div>
            )
          } as FormikSelectDropdownOption;
        });
      }
    },
    keepPreviousData: true,
    staleTime: 0,
    cacheTime: 0
  });

  const handleSearchDebounced = useRef(
    debounce((searchText) => setSearchText(searchText), 300)
  ).current;

  const handleInputChange = (inputText: string, meta: InputActionMeta) => {
    if (meta.action !== "input-blur" && meta.action !== "menu-close") {
      setInputText(inputText);
      if (inputText === "" || field.value) {
        return;
      }
      handleSearchDebounced(inputText);
    }
  };

  const value = useMemo(() => {
    return options?.filter((item) => item.value === field.value);
  }, [field.value, options]);

  return (
    <div className={className}>
      {label && <label className="form-label">{label}</label>}
      <Select
        name={name}
        isLoading={isLoading || isRefetching}
        className="h-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        options={options}
        noOptionsMessage={(input) => {
          if (input.inputValue) {
            return "No options found";
          }
          return "Start typing to search";
        }}
        isClearable
        value={value}
        onChange={(value: any) => {
          field.onChange({
            target: {
              name: field.name,
              value: Array.isArray(value)
                ? value.map((item) => item.value)
                : value?.value
            }
          });
        }}
        onInputChange={handleInputChange}
        inputValue={inputText ?? value}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 })
        }}
        menuPosition={"fixed"}
        menuShouldBlockScroll={true}
        onBlur={(event) => {
          field.onBlur(event);
          setIsTouched(true);
        }}
        onFocus={(event) => {
          field.onBlur(event);
          setIsTouched(true);
        }}
        filterOption={null}
        components={{
          Option: ({ children, ...props }) => {
            return (
              <components.Option {...props}>
                <div className="flex flex-row items-center gap-2 text-sm">
                  {(props.data as any).icon && (
                    // eslint-disable-next-line react/jsx-no-useless-fragment
                    <>{(props.data as any).icon}</>
                  )}
                  <div className="flex-1 break-before-all text-ellipsis whitespace-nowrap">
                    {children}
                  </div>
                </div>
              </components.Option>
            );
          },
          SingleValue: ({ children, ...props }) => {
            return (
              <components.SingleValue {...props}>
                <div className="flex flex-row items-center gap-2">
                  {(props.data as any).icon && (
                    // eslint-disable-next-line react/jsx-no-useless-fragment
                    <>{(props.data as any).icon}</>
                  )}
                  <div className="flex-1 break-after-all text-ellipsis whitespace-nowrap">
                    {children}
                  </div>
                </div>
              </components.SingleValue>
            );
          }
        }}
        windowThreshold={20}
      />
      <p className="text-sm text-gray-500">
        {
          "Filter the list using queries e.g: name=grafana type=Kubernetes::Deployment or health=healthy,unhealthy"
        }
        {hintLink && (
          <HelpLink
            link="reference/resource-selector#search"
            title=""
            className="ml-1"
            iconID="help-resource-selector"
          />
        )}
      </p>
      {isTouched && meta.error ? (
        <p className="w-full py-1 text-sm text-red-500">{meta.error}</p>
      ) : null}
    </div>
  );
}
