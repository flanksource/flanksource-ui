import React, { ComponentProps, MouseEventHandler } from "react";
import Select, {
  components,
  MultiValueGenericProps,
  MultiValueProps,
  Props,
  OnChangeValue,
  ActionMeta
} from "react-select";
import {
  SortableContainer,
  SortableContainerProps,
  SortableElement,
  SortEndHandler,
  SortableHandle
} from "react-sortable-hoc";
import { arrayMove } from "react-sortable-hoc";

export type GroupByOptions = {
  isTag?: boolean;
  value: string;
  label: string;
  icon?: React.ReactNode;
};

type ConfigGroupByDropdownProps = Omit<
  ComponentProps<typeof Select>,
  "components" | "defaultValue" | "windowThreshold"
> & {
  label?: string;
  containerClassName?: string;
  dropDownClassNames?: string;
  defaultValue?: string;
  closeMenuOnSelect?: boolean;
  value?: readonly GroupByOptions[];
};

export function NonWindowedMultiSelectDropdown({
  isMulti = true,
  isClearable = true,
  options,
  className = "w-auto max-w-[400px]",
  label,
  containerClassName = "w-full",
  dropDownClassNames = "w-auto max-w-[300px]",
  value,
  defaultValue,
  closeMenuOnSelect = false,
  onChange = () => {},
  ...props
}: ConfigGroupByDropdownProps) {
  const SortableMultiValue = SortableElement(
    (props: MultiValueProps<GroupByOptions>) => {
      // this prevents the menu from being opened/closed when the user clicks
      // on a value to begin dragging it. ideally, detecting a click (instead of
      // a drag) would still focus the control and toggle the menu, but that
      // requires some magic with refs that are out of scope for this example
      const onMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };
      const innerProps = { ...props.innerProps, onMouseDown };
      return <components.MultiValue {...props} innerProps={innerProps} />;
    }
  );

  const SortableMultiValueLabel = SortableHandle(
    (props: MultiValueGenericProps) => <components.MultiValueLabel {...props} />
  );

  const SortableSelect = SortableContainer(Select) as React.ComponentClass<
    Props<GroupByOptions, true> & SortableContainerProps
  >;

  const [selected, setSelected] = React.useState<readonly GroupByOptions[]>(
    value || []
  );

  const onSortEnd: SortEndHandler = ({ oldIndex, newIndex }) => {
    const newValue = arrayMove([...selected], oldIndex, newIndex);
    setSelected(newValue);
    onChange(newValue as OnChangeValue<GroupByOptions, true>, {
      action: "select-option",
      option: newValue[newIndex],
      name: props.name
    });
  };

  return (
    <SortableSelect
      useDragHandle
      axis="xy"
      distance={4}
      onSortEnd={onSortEnd}
      helperClass="dragging"
      getHelperDimensions={({ node }: { node: HTMLElement }) =>
        node.getBoundingClientRect()
      }
      isClearable={isClearable}
      isMulti
      options={options}
      value={selected}
      onChange={(
        value: OnChangeValue<GroupByOptions, true>,
        actionMeta: ActionMeta<GroupByOptions>
      ) => {
        setSelected(value);
        onChange(value, actionMeta);
      }}
      {...(props as any)}
      components={{
        MultiValue: SortableMultiValue,
        MultiValueLabel: SortableMultiValueLabel
      }}
      styles={{
        ...props.styles,
        multiValue: (base) => ({
          ...base,
          backgroundColor: "var(--select-multi-value-color, #e2e8f0)",
          borderRadius: "0.375rem"
        }),
        multiValueLabel: (base) => ({
          ...base,
          color: "var(--select-multi-value-label-color, #1f2937)",
          fontSize: "0.875rem",
          padding: "0.25rem 0.5rem",
          cursor: "move"
        }),
        multiValueRemove: (base) => ({
          ...base,
          color: "var(--select-multi-value-remove-color, #4b5563)",
          cursor: "pointer",
          ":hover": {
            backgroundColor:
              "var(--select-multi-value-remove-hover-color, #dc2626)",
            color: "white"
          }
        })
      }}
    />
  );
}
