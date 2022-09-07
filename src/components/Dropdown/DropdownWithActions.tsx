import { useCallback, useEffect, useState } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import AsyncSelect from "react-select/async";
import { IItem } from "../../types/IItem";
import { components } from "react-select";
import { debounce } from "lodash";

interface IDropdownWithActionsProps<T> {
  label: string;
  name: string;
  onQuery: (s: string) => Promise<T[]>;
  creatable?: boolean;
  displayOption: (props: {
    selected: boolean;
    option: T;
    active: boolean;
  }) => React.ReactNode;
  value?: T;
  setValue: any;
  dependentValue?: any;
}

export function DropdownWithActions<T extends IItem>({
  label,
  name,
  creatable,
  onQuery,
  value = { value: null, description: "" } as T,
  displayOption,
  setValue,
  dependentValue
}: IDropdownWithActionsProps<T>) {
  const [lastNoResultsQuery, setLastNoResultsQuery] = useState("");
  const [defaultOptions, setDefaultOptions] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkIfItIsANoResultsQuery = (
    query: string,
    lastNoResultsQuery: string
  ) => {
    return (
      lastNoResultsQuery && query && query.indexOf(lastNoResultsQuery) === 0
    );
  };

  const getOptions = useCallback(
    debounce(
      (
        query: string,
        callback,
        lastNoResultsQuery: string,
        hideLoader?: boolean
      ): any => {
        if (checkIfItIsANoResultsQuery(query, lastNoResultsQuery)) {
          return callback([]);
        }
        async function fetch() {
          setIsLoading(true && !hideLoader);
          let res = (await onQuery(query)) || [];
          if (!res.length) {
            setLastNoResultsQuery(query);
          } else {
            setLastNoResultsQuery("");
          }
          callback(res);
          setIsLoading(false);
        }
        fetch();
      },
      100
    ),
    []
  );

  const loadDefaultOptions = (hideLoader?: boolean) => {
    getOptions(
      "",
      (data: any[]) => {
        setDefaultOptions(data);
      },
      "",
      hideLoader
    );
  };

  const onChangeInputFn = (inputValue: string, { action }: any) => {
    if (action === "menu-close") {
      loadDefaultOptions(true);
    }
  };

  useEffect(() => {
    loadDefaultOptions();
  }, [dependentValue]);

  return creatable ? (
    <AsyncCreatableSelect
      name={name}
      className="relative mt-1"
      cacheOptions
      defaultOptions={defaultOptions}
      loadOptions={(query, callback) => {
        getOptions(query, callback, lastNoResultsQuery);
      }}
      value={value}
      getOptionValue={(option: any) => option.value}
      getOptionLabel={(option: any) => option.description || option.value}
      createOptionPosition="first"
      onInputChange={onChangeInputFn}
      isLoading={isLoading}
      onChange={(e) => {
        setLastNoResultsQuery("");
        setValue(name, {
          ...e,
          description: e?.description || e?.value
        });
      }}
      components={{
        Option: (props: any) => {
          return (
            <components.Option {...props}>
              {displayOption({ option: props.data } as any)}
            </components.Option>
          );
        }
      }}
    />
  ) : (
    <AsyncSelect
      name={name}
      className="relative mt-1"
      cacheOptions
      defaultOptions={defaultOptions}
      loadOptions={getOptions}
      value={value}
      isLoading={isLoading}
      getOptionValue={(option: any) => option.value}
      getOptionLabel={(option: any) => option.description || option.value}
      onChange={(e) => {
        setLastNoResultsQuery("");
        setValue(name, {
          ...e,
          description: e?.description || e?.value
        });
      }}
      onInputChange={onChangeInputFn}
      components={{
        Option: (props: any) => {
          return (
            <components.Option {...props}>
              {displayOption({ option: props.data } as any)}
            </components.Option>
          );
        }
      }}
    />
  );
}
