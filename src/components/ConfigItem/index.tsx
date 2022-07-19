import { ComponentType, useMemo } from "react";
import AsyncSelect from "react-select/async";
import { components, GroupBase, OptionProps } from "react-select";
import { debounce } from "lodash";
import { searchConfigs } from "../../api/services/configs";
import { Props } from "react-select/dist/declarations/src/Select";

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
      <div>
        {data.name && (
          <div className="mr-4">
            <span className="bg-blue-100 rounded mr-1 px-1 text-black">
              Name:
            </span>
            <span>{data.name}</span>
          </div>
        )}
        {data.external_id && (
          <div>
            <span className="bg-red-100 rounded mr-1 px-1 text-black">ID:</span>
            <span>{data.external_id}</span>
          </div>
        )}
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
  const handleSearch = useMemo(
    () =>
      debounce(async (input: string) => {
        const { data } = await searchConfigs(type, input);

        return (data || []).map((item) => ({
          ...item,
          value: item.id,
          label: item.name || item.external_id
        }));
      }, 500),
    [type]
  );

  return (
    <AsyncSelect
      key={type} // used to re-render AsyncSelect on update type
      isClearable
      defaultOptions
      loadOptions={handleSearch}
      {...props}
      onChange={onSelect}
      components={{
        Option
      }}
    />
  );
};
