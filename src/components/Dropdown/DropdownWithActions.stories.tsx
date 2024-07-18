import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Controller, useForm } from "react-hook-form";
import { IncidentSeverity } from "../../api/types/incident";
import { TextInput } from "../../ui/FormControls/TextInput";
import { severityItems } from "../Incidents/data";
import { DropdownWithActions } from "./DropdownWithActions";

export default {
  title: "Dropdown/DropdownWithActions",
  component: DropdownWithActions
} as ComponentMeta<typeof DropdownWithActions>;

const Template: ComponentStory<typeof DropdownWithActions> = (args) => {
  const items = Object.values(severityItems);
  const { control, getValues, setValue } = useForm<{
    severity: string;
    something: IncidentSeverity | string;
  }>({
    defaultValues: {
      severity: severityItems.Low.value,
      something: severityItems.Low.value
    }
  });

  const onQuery = (query: string) => {
    const filtered =
      query === ""
        ? items
        : items.map((option) => ({
            value: `${query} ${option.value}`,
            description: `${query} ${option.description}`
          }));

    return Promise.resolve(filtered);
  };

  return (
    <div className="flex max-w-prose flex-col space-y-4">
      <div className="flex">
        <Controller
          control={control}
          name="severity"
          render={({ field: { onChange, value } }) => {
            const itemValue = items.find(
              (x) => x.value === getValues("severity")
            );

            return (
              <DropdownWithActions
                {...args}
                onQuery={onQuery}
                name="severity"
                label="Input"
                value={itemValue}
                setValue={setValue}
                displayOption={({ option }) => {
                  return (
                    <div className="text-gray-900">
                      <b>{option.description}</b>
                    </div>
                  );
                }}
              />
            );
          }}
        />
      </div>
      {getValues("severity") === null && (
        <div className="flex flex-col space-y-4">
          <Controller
            control={control}
            name="severity"
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
  label: "Severity",
  name: "severity"
};
