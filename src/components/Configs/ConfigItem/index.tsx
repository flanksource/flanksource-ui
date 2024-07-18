import clsx from "clsx";
import { JSONPath } from "jsonpath-plus";
import { debounce } from "lodash";
import React, { ComponentType, useCallback, useEffect, useState } from "react";
import { Control, Controller } from "react-hook-form";
import Select, {
  GroupBase,
  OptionProps,
  Props,
  SingleValueProps,
  components
} from "react-select";
import AsyncSelect from "react-select/async";
import { getConfig, searchConfigs } from "../../../api/services/configs";
import { useLoader } from "../../../hooks";

interface IOption {
  name: string;
  external_id: string;
}

export const SingleValue = ({ ...props }: SingleValueProps<IOption>) => {
  return (
    <components.SingleValue {...props}>
      <div className="flex flex-wrap">{props.data.name}</div>
    </components.SingleValue>
  );
};

const Option: ComponentType<
  OptionProps<IOption, false, GroupBase<IOption>>
> = ({ children, ...props }) => {
  const { data } = props;
  return (
    <components.Option {...props}>
      <div
        className="relative cursor-pointer p-2 text-sm text-gray-900"
        id="listbox-option-0"
      >
        <div className="flex flex-col">
          {data.name && (
            <div className="flex justify-between">
              <p className="text-sm">
                <span className="inline-block w-12 pr-2 text-xs font-bold text-gray-400">
                  Name:
                </span>
                {data.name}
              </p>
            </div>
          )}
          {data.external_id && (
            <p
              className={clsx(
                !data.name
                  ? "text-sm text-gray-900"
                  : "mt-2 text-xs text-gray-500"
              )}
            >
              <span
                className={clsx(
                  "inline-block pr-2 text-xs font-bold text-gray-400",
                  data.external_id && data.name ? "w-12" : "w-6"
                )}
              >
                ID:
              </span>
              {data.external_id}
            </p>
          )}
        </div>
      </div>
    </components.Option>
  );
};

interface IProps extends Props<IOption, false, GroupBase<IOption>> {
  type: string;
  value: any;
  autoFetch: boolean;
  data?: any[];
  itemsPath?: string;
  namePath?: string;
  valuePath?: string;
  className?: string;
  control?: Control;
  name: string;
  description?: React.ReactNode;
  label?: React.ReactNode;
  children?: React.ReactNode;
  onSelect: (arg: any) => void;
  rules?: any;
}

export const ConfigItem = ({
  type,
  value,
  onSelect,
  data,
  itemsPath,
  namePath,
  valuePath,
  autoFetch,
  children,
  control,
  name,
  description,
  label,
  rules,
  ...props
}: IProps) => {
  const { loading, setLoading } = useLoader();
  const [options, setOptions] = useState([]);
  const [dependentOptions, sentDependentOptions] = useState<any>(null);

  const loadOptions = useCallback(
    (input: string, callback: (data: any) => void) => {
      setLoading(true);
      searchConfigs(type, input)
        .then(({ data }: any) => {
          setLoading(false);
          callback(
            (data || []).map((item: any) => ({
              ...item,
              value: item.id,
              label: item.name || item.external_id
            }))
          );
        })
        .catch((err) => {
          setLoading(false);
          callback([]);
        });
      return;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type]
  );

  useEffect(() => {
    if (autoFetch) {
      getConfigDetails(value?.value);
    } else {
      if (typeof value === "string" && options.length) {
        const selectedOption = options.find((option: any) => {
          return (
            option.value === value ||
            option.label === value ||
            option.name === value
          );
        });
        if (!selectedOption) {
          return;
        }
        onSelect(selectedOption);
        sentDependentOptions(selectedOption);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, options]);

  useEffect(() => {
    if (!data) {
      setOptions([]);
      return;
    }
    try {
      const response = JSONPath({
        path: itemsPath as string,
        json: data
      });
      const items =
        response?.map((item: any) => {
          return {
            name: JSONPath({ path: namePath as string, json: item })?.[0],
            value: JSONPath({ path: valuePath as string, json: item })?.[0],
            data: item
          };
        }) || [];
      setOptions(items);
    } catch (ex) {
      console.error(ex);
      setOptions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const getConfigDetails = async (id: string) => {
    sentDependentOptions(null);
    if (!id) {
      return;
    }
    const response = await getConfig(id);
    if (response?.data) {
      sentDependentOptions(response.data[0]);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedLoadOptions = useCallback(debounce(loadOptions, 500), [
    loadOptions
  ]);

  const getEnhancedChildren = () => {
    return React.Children.map(children, (Child: any) => {
      if (Child?.type?.displayName === "ConfigItem") {
        return React.cloneElement(
          Child,
          {
            ...Child.props,
            data: dependentOptions
          },
          Child.props.children
        );
      }
      return Child;
    });
  };

  const getLabel = () => {
    return (
      <>
        {label && typeof label === "string" && (
          <label className="form-label mb-2">{label}</label>
        )}
        {label && typeof label !== "string" && label}
      </>
    );
  };

  const getDescription = () => {
    return (
      <>
        {description && typeof description === "string" && (
          <div className="mb-2 bg-white px-2 text-xs font-semibold text-gray-500">
            {description}
          </div>
        )}
        {description && typeof description !== "string" && description}
      </>
    );
  };

  const getControl = (onSelectFn: any, controlValue: any) => {
    if (autoFetch) {
      return (
        <>
          {getLabel()}
          <AsyncSelect
            key={type}
            isClearable
            defaultOptions
            loadOptions={debouncedLoadOptions}
            {...props}
            onChange={(e: any) => {
              onSelectFn(e);
              getConfigDetails(e?.value);
            }}
            components={{
              Option
            }}
            isLoading={loading}
            value={controlValue}
            getOptionValue={(item: any) => item.value}
          />
          {getDescription()}
          {getEnhancedChildren()}
        </>
      );
    } else {
      return (
        <>
          {getLabel()}
          <Select
            options={options}
            isClearable
            {...props}
            onChange={(e: any) => {
              onSelectFn(e);
              sentDependentOptions(e);
            }}
            components={{
              Option,
              SingleValue
            }}
            value={controlValue}
            getOptionValue={(item: any) => item.value}
          />
          {getDescription()}
          {getEnhancedChildren()}
        </>
      );
    }
  };

  return control ? (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const { onChange: onChangeControlled, value: valueControlled } = field;
        return getControl((e: any) => {
          onSelect(e);
          onChangeControlled(e);
        }, valueControlled);
      }}
      rules={rules}
    />
  ) : (
    getControl(onSelect, value)
  );
};

ConfigItem.displayName = "ConfigItem";
