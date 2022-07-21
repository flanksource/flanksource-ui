import { ComponentType, useCallback, useMemo } from "react";
import AsyncSelect from "react-select/async";
import { components, GroupBase, OptionProps } from "react-select";
import { debounce } from "lodash";
import { searchConfigs } from "../../api/services/configs";
import { Props } from "react-select/dist/declarations/src/Select";
import { useLoader } from "../../hooks";
import clsx from "clsx";

interface IOption {
  name: string;
  external_id: string;
}

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
  onSelect: (arg: any) => void;
}

export const ConfigItem = ({ type, value, onSelect, ...props }: IProps) => {
  const { loading, setLoading } = useLoader();

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

  const debouncedLoadOptions = useCallback(debounce(loadOptions, 500), [
    loadOptions
  ]);

  return (
    <AsyncSelect
      key={type} // used to re-render AsyncSelect on update type
      isClearable
      defaultOptions
      loadOptions={debouncedLoadOptions}
      {...props}
      onChange={onSelect}
      components={{
        Option
      }}
      isLoading={loading}
    />
  );
};
