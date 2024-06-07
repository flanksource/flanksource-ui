import { TristateToggle } from "@flanksource-ui/ui/FormControls/TristateToggle";
import { ChevronDownIcon } from "@heroicons/react/solid";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { HiCheck } from "react-icons/hi";
import { useSearchParams } from "react-router-dom";
import { Toggle } from "../../../ui/FormControls/Toggle";
import { GroupByDropdown } from "../../Dropdown/GroupByDropdown";
import { LayoutDropdown } from "../../Dropdown/LayoutDropdown";
import { PivotByDropdown } from "../../Dropdown/PivotByDropdown";
import { PivotCellTypeDropdown } from "../../Dropdown/PivotCellTypeDropdown";
import { PivotLabelDropdown } from "../../Dropdown/PivotLabelDropdown";
import { TabByDropdown } from "../../Dropdown/TabByDropdown";
import { TimeRange } from "../../Dropdown/TimeRange";
import { DropdownMenu } from "../../DropdownMenu";
import { Select, components } from "../../Select";
import { setDeepWithString } from "../CanaryPopup/utils";
import { separateLabelsByBooleanType } from "../labels";
import { getDefaultForm, initialiseFormState, updateFormState } from "../state";
import { decodeUrlSearchParams, useUpdateParams } from "../url";

export function FilterForm({
  labels,
  checks,
  filterLabels,
  hideLabelFilters,
  hideTimeRange,
  className,
  controlsContainerClassName,
  controlsControllerClassName,
  filtersContainerClassName,
  healthFilterClassName,
  labelFilterClassName,
  onServerSideFilterChange = null
}) {
  const [searchParams] = useSearchParams();
  const updateParams = useUpdateParams();
  const { formState, fullState } = initialiseFormState(
    getDefaultForm(labels),
    searchParams
  );

  const { control, watch, reset, getValues, setValue } = useForm({
    defaultValues: formState
  });

  useEffect(() => {
    updateParams(fullState);
    reset(formState);
  }, [updateParams, formState, fullState, labels, reset]);

  // only trigger filter change on 2nd render and onwards
  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else if (onServerSideFilterChange != null) {
      onServerSideFilterChange();
    }
  }, [formState.timeRange, onServerSideFilterChange]);

  const watchLayout = watch("layout");
  const watchPivotBy = watch("pivotBy");

  useEffect(() => {
    const watchAll = watch((data) => {
      const searchParams = window.location.search;
      const { formState } = updateFormState(data, searchParams, labels);
      updateParams(formState);
    });
    return () => {
      watchAll.unsubscribe();
    };
  });

  const [booleanLabels, nonBooleanLabels] = separateLabelsByBooleanType(
    Object.values(filterLabels)
  );

  return (
    <form className={`relative ${className}`}>
      <SectionTitle>Controls</SectionTitle>
      <div className={controlsContainerClassName}>
        {!hideTimeRange && (
          <TimeRange
            control={control}
            name="timeRange"
            className={controlsControllerClassName}
            label="Time Range"
          />
        )}
        <LayoutDropdown
          control={control}
          name="layout"
          className={controlsControllerClassName}
          label="Layout"
        />

        {watchLayout === "table" && (
          <>
            <GroupByDropdown
              name="groupBy"
              control={control}
              className={controlsControllerClassName}
              label="Group By"
              checks={checks}
            />
            <PivotByDropdown
              name="pivotBy"
              control={control}
              className={controlsControllerClassName}
              label="Pivot By"
              checks={checks}
            />
          </>
        )}
        <TabByDropdown
          name="tabBy"
          control={control}
          className={controlsControllerClassName}
          label="Tab By"
          checks={checks}
        />
      </div>

      {!(watchPivotBy == null || watchPivotBy === "none") && (
        <div>
          <SectionTitle>Pivot Settings</SectionTitle>
          <div className={controlsContainerClassName}>
            {watchPivotBy !== "none" && (
              <PivotCellTypeDropdown
                name="pivotCellType"
                control={control}
                className={controlsControllerClassName}
                label="Cell Type"
                checks={checks}
              />
            )}
            {watchPivotBy === "labels" && (
              <PivotLabelDropdown
                name="pivotLabel"
                control={control}
                className={controlsControllerClassName}
                label="Pivot Label"
                checks={checks}
              />
            )}
          </div>
        </div>
      )}

      <div className={filtersContainerClassName}>
        <div className={healthFilterClassName}>
          <SectionTitle>Filter By Health</SectionTitle>
          <Controller
            key="hidePassing"
            name="hidePassing"
            control={control}
            render={({ field: { ref, ...rest } }) => (
              <Toggle label="Hide Passing" {...rest} />
            )}
          />
        </div>
        {!hideLabelFilters && (
          <div className={labelFilterClassName}>
            <SectionTitle>Filter By Label</SectionTitle>
            <div className="flex w-full">
              <div
                className={filtersContainerClassName}
                style={{ zIndex: 5, maxWidth: "300px" }}
              >
                <LabelFilterDropdown
                  name="labelFilter"
                  labels={nonBooleanLabels}
                  onChange={(selected, all) => {
                    // get current label state
                    let newState = getValues("labels");

                    // initialize all nonBooleanLabels with 0s
                    all.forEach((label) => {
                      newState = setDeepWithString(label.value, 0, newState);
                    });

                    // alter selected labels with 1s
                    selected.forEach((label) => {
                      newState = setDeepWithString(label.value, 1, newState);
                    });

                    // set form
                    setValue("labels", newState);
                  }}
                />
              </div>
              <div
                className={filtersContainerClassName}
                style={{ zIndex: "5" }}
              >
                <DropdownMenu
                  buttonClass="w-full"
                  buttonElement={
                    <div
                      className="border border-gray-300 w-full flex items-center justify-between px-2 py-2"
                      style={{ height: "38px", borderRadius: "4px" }}
                    >
                      <span className="text-sm text-gray-500">
                        Boolean labels
                      </span>
                      <ChevronDownIcon
                        style={{
                          height: "20px",
                          color: "#8f8f8f",
                          marginLeft: "12px"
                        }}
                      />
                    </div>
                  }
                  content={
                    <div className="px-4 py-2">
                      {booleanLabels
                        .filter((o) => o && o !== undefined)
                        .map((label) => (
                          <Controller
                            key={label.id}
                            name={`labels.${label.id}`}
                            control={control}
                            render={({ field: { ref, ...rest } }) => (
                              <TristateToggle
                                key={label.key}
                                className="mb-2"
                                label={label}
                                {...rest}
                              />
                            )}
                          />
                        ))}
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}

const SectionTitle = ({ className, children, ...props }) => (
  <div
    className={`uppercase font-semibold text-sm mb-3 text-blue-700 ${className}`}
    {...props}
  >
    {children}
  </div>
);

const Option = (props) => {
  const { isSelected, children } = props;

  return (
    <components.Option {...props}>
      <div className="flex justify-between">
        <span>{children}</span>
        <span className="ml-2">
          {isSelected && <HiCheck className="h-5 w-5" />}
        </span>
      </div>
    </components.Option>
  );
};

const ConciseLabelsValueContainer = ({
  children,
  conciseLimit = 4,
  ...props
}) => {
  const currentValues = props.getValue();
  let toBeRendered = children;

  if (
    currentValues.some(
      (val) => val.value === props.selectProps.allOption?.value
    )
  ) {
    toBeRendered = React.Children.toArray(children).filter(
      (c) =>
        !c.props.data ||
        c.props.data.value !== props.selectProps.allOption?.value
    );
  }

  return (
    <components.ValueContainer {...props}>
      {currentValues.length < conciseLimit ? (
        toBeRendered
      ) : (
        <div className="text-md text-gray-500">
          including {currentValues.length === props.options.length && "all "}
          <span className="text-sm font-semibold">
            {currentValues.length === props.options.length
              ? currentValues.length - 1
              : currentValues.length}
          </span>{" "}
          labels
        </div>
      )}
    </components.ValueContainer>
  );
};

export const LabelFilterDropdown = ({
  labels,
  onChange,
  loadFromURL,
  name,
  ...rest
}) => {
  const [selected, setSelected] = useState([]);
  const [options, setOptions] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const newOptions = labels.map((label) => ({
      value: label.id,
      label: label.value
    }));
    setOptions(newOptions);
  }, [labels]);

  useEffect(() => {
    onChange(selected, options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // get initial selected labels from URL params on first load
  useEffect(() => {
    if (loadFromURL && isInitialLoad && labels?.length > 0) {
      const { labels: urlLabelState } = decodeUrlSearchParams(
        window.location.search
      );
      const initialSelected = Object.entries(urlLabelState || {}).reduce(
        (acc, [labelKey, v]) => {
          if (v === 1 && labels.findIndex((o) => o.id === labelKey) > -1) {
            acc.push({
              value: labelKey,
              label: labels.find((o) => o.id === labelKey)?.value || labelKey
            });
          }
          return acc;
        },
        []
      );
      setSelected(initialSelected);
      setIsInitialLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialLoad, labels]);

  return (
    <Select
      name={name}
      styles={{
        control: (styles) => ({ ...styles, minWidth: "200px" }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        option: (styles) => ({
          ...styles,
          overflowX: "hidden",
          overflowWrap: "anywhere",
          fontSize: "12px"
        }),
        valueContainer: (styles) => ({
          ...styles,
          flexWrap: "nowrap",
          fontSize: "14px"
        })
      }}
      options={options}
      value={selected}
      isMulti
      allowSelectAll
      hideSelectedOptions={false}
      components={{ Option }}
      onChange={setSelected}
      customValueContainer={ConciseLabelsValueContainer}
      menuPortalTarget={document.body}
      menuPosition={"fixed"}
      menuShouldBlockScroll={true}
      {...rest}
    />
  );
};
