import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IncidentSeverity } from "../../api/services/incident";
import { INCIDENT_SEVERITY_OPTIONS } from "../../constants/incidentOptions";
import { IItem } from "../../types/IItem";
import { TextInput } from "../TextInput";
import { DropdownWithActions } from "./DropdownWithActions";

export default {
  title: "Dropdown/DropdownWithActions",
  component: DropdownWithActions
} as ComponentMeta<typeof DropdownWithActions>;

const Template: ComponentStory<typeof DropdownWithActions> = (args: any) => {
  const { items } = args;
  const {
    control,
    formState: { errors },
    getValues,
    watch
  } = useForm<{ severity: IItem; something: IncidentSeverity }>({
    defaultValues: {
      severity: INCIDENT_SEVERITY_OPTIONS[0],
      something: INCIDENT_SEVERITY_OPTIONS[0].value
    }
  });

  const onQuery = (query) => {
    const filtered =
      query === ""
        ? items
        : items.map((option) => ({
            value: `${query} ${option.value}`,
            description: `${query} ${option.description}`
          }));

    return Promise.resolve(filtered);
  };

  watch("severity");

  return (
    <div className="flex flex-col max-w-prose space-y-4">
      <div className="flex">
        <Controller
          control={control}
          name="severity"
          render={({ field: { onChange, value } }) => {
            return (
              <DropdownWithActions
                {...args}
                onQuery={onQuery}
                name="severity"
                label="Input"
                value={value}
                displayValue={(x) => x.description}
                onChange={(args) => console.log(args) || onChange(args)}
                errors={errors}
              />
            );
          }}
        />
      </div>
      {getValues("severity").value === null && (
        <div className="flex flex-col space-y-4">
          <Controller
            control={control}
            name="description"
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <TextInput
                  label="Description"
                  id="description"
                  className="w-full"
                  onChange={onChange}
                  value={value}
                />
              );
            }}
          />
        </div>
      )}
    </div>
  );
};

export const Base = Template.bind({});

Base.args = {
  className: "w-32",
  items: INCIDENT_SEVERITY_OPTIONS,
  label: "Severity",
  name: "severity",
  displayValue: ({ value }) => value?.description
};
