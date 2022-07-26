import {
  ComponentType,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import AsyncSelect from "react-select/async";
import { components, GroupBase, OptionProps } from "react-select";
import { debounce } from "lodash";
import { getConfig, searchConfigs } from "../../api/services/configs";
import Select, { Props } from "react-select";
import { useLoader } from "../../hooks";
import clsx from "clsx";
import { JSONPath } from "jsonpath-plus";

interface IOption {
  name: string;
  external_id: string;
}

export const SingleValue = ({ ...props }) => {
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
        className="text-gray-900 cursor-pointer relative p-2 text-sm"
        id="listbox-option-0"
        role="option"
      >
        <div className="flex flex-col">
          {data.name && (
            <div className="flex justify-between">
              <p className="text-sm">
                <span className="text-xs font-bold text-gray-400 pr-2 w-12 inline-block">
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
                  ? "text-gray-900 text-sm"
                  : "text-gray-500 text-xs mt-2"
              )}
            >
              <span
                className={clsx(
                  "text-xs font-bold text-gray-400 pr-2 inline-block",
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
  dependentConfigItems?: IProps[];
  className?: string;
  onSelect: (arg: any) => void;
}

export const ConfigItem = ({
  type,
  value,
  onSelect,
  data,
  itemsPath,
  namePath,
  valuePath,
  dependentConfigItems = [],
  autoFetch,
  ...props
}: IProps) => {
  const { loading, setLoading } = useLoader();
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
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
    [type]
  );

  useEffect(() => {
    if (!data) {
      setOptions([]);
      return;
    }
    const response = JSONPath({
      path: itemsPath as string,
      json: data
    });
    const items = response?.[0].map((item: any) => {
      return {
        name: JSONPath({ path: namePath as string, json: item })?.[0],
        value: JSONPath({ path: valuePath as string, json: item })?.[0]
      };
    });
    setOptions(items);
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

  const debouncedLoadOptions = useCallback(debounce(loadOptions, 500), [
    loadOptions
  ]);

  if (autoFetch) {
    return (
      <>
        <AsyncSelect
          key={type} // used to re-render AsyncSelect on update type
          isClearable
          defaultOptions
          loadOptions={debouncedLoadOptions}
          {...props}
          onChange={(e: any) => {
            onSelect(e);
            setSelectedOption(e);
            getConfigDetails(e?.value);
          }}
          components={{
            Option
          }}
          isLoading={loading}
        />
        {selectedOption &&
          dependentConfigItems.map((configItem) => {
            return <ConfigItem {...configItem} data={dependentOptions} />;
          })}
      </>
    );
  } else {
    return (
      <>
        <Select
          options={options}
          isClearable
          {...props}
          onChange={onSelect}
          components={{
            Option,
            SingleValue
          }}
          defaultValue={value}
          getOptionValue={(item: any) => item.value}
        />
        {selectedOption &&
          dependentConfigItems.map((configItem) => {
            return <ConfigItem {...configItem} data={dependentOptions} />;
          })}
      </>
    );
  }
};
