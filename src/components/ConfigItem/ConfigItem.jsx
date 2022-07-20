import React, { useMemo } from "react";
import AsyncSelect from "react-select/async";
import { components } from "react-select";
import { debounce } from "lodash";
import PropTypes from "prop-types";
import { searchConfigs } from "../../api/services/configs";

const Option = ({ children, ...props }) => {
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

export const ConfigItem = ({ type, value, onSelect, ...props }) => {
  const handleSearch = useMemo(
    () =>
      debounce((input, callback) => {
        searchConfigs(type, input).then(({ data }) => {
          console.log(data);
          const prepareData = data.map((item) => ({
            ...item,
            value: item.id,
            label: item.name || item.external_id
          }));
          callback(prepareData);
        });
      }, 500),
    [type]
  );

  return (
    <AsyncSelect
      key={type} // used to re-render AsyncSelect on update type
      isClearable
      defaultOptions
      loadOptions={handleSearch}
      onChange={onSelect}
      components={{
        Option
      }}
      {...props}
    />
  );
};

ConfigItem.propTypes = {
  type: PropTypes.string.isRequired,
  onSelect: PropTypes.func
};

ConfigItem.defaultProps = {
  onSelect: () => {}
};
