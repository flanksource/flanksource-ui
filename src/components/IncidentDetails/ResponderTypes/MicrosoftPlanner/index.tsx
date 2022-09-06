import clsx from "clsx";
import { useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue
} from "react-hook-form";
import { ConfigItem } from "../../../ConfigItem";
import { TextInput } from "../../../TextInput";
import { AddResponderFormValues } from "../../AddResponder";

type MicrosoftProps = {
  control: Control;
  errors: FieldErrors;
  setValue: UseFormSetValue<AddResponderFormValues>;
} & React.HTMLProps<HTMLDivElement>;

export const MicrosoftPlanner = ({
  control,
  errors,
  setValue,
  className,
  ...rest
}: MicrosoftProps) => {
  const [msProjectType, setMsProjectType] = useState();
  const [planId, setPlanId] = useState();
  const [bucketId, setBucketId] = useState();
  const [priority, setPriority] = useState();

  return (
    <div className={clsx(className)} {...rest}>
      <div className="mb-4">
        <ConfigItem
          type="MSPlanner"
          control={control}
          name="configType"
          autoFetch={true}
          onSelect={(e: any) => {
            setMsProjectType(e);
            setValue("project", "");
            setValue("issueType", "");
          }}
          label={
            <label className="block text-sm font-bold text-gray-700 mb-2">
              MSPlanner Config Type
            </label>
          }
          value={msProjectType}
          id="config-type"
          rules={{
            required: "Please provide valid value"
          }}
        >
          <p className="text-red-600 text-sm">{errors?.configType?.message}</p>
          <ConfigItem
            type="MSPlanner"
            control={control}
            name="plan_id"
            value={planId}
            autoFetch={false}
            onSelect={(selected) => {
              setPlanId(selected);
              setValue("plan_id", "");
            }}
            itemsPath="$..plans[*]"
            namePath="$.name"
            valuePath="$.id"
            label={
              <label
                htmlFor="plan_id"
                className="block text-sm font-bold text-gray-700 mb-2 mt-4"
              >
                Plan ID
              </label>
            }
            isDisabled={!msProjectType}
            id="plan_id"
            rules={{
              required: "Please provide valid value"
            }}
          >
            <p className="text-red-600 text-sm">{errors?.plan_id?.message}</p>
            <ConfigItem
              type="MSPlanner"
              control={control}
              name="bucket_id"
              value={bucketId}
              autoFetch={false}
              onSelect={(selected) => {
                setBucketId(selected);
              }}
              itemsPath="$..buckets[*]"
              namePath="$.name"
              valuePath="$.id"
              label={
                <label
                  htmlFor="bucket_id"
                  className="block text-sm font-bold text-gray-700 mb-2 mt-4"
                >
                  Bucket ID
                </label>
              }
              isDisabled={!msProjectType}
              id="bucket_id"
              rules={{
                required: "Please provide valid value"
              }}
            />
            <p className="text-red-600 text-sm">{errors.bucket_id?.message}</p>
            <ConfigItem
              type="MSPlanner"
              control={control}
              name="priority"
              value={priority}
              autoFetch={false}
              onSelect={(selected) => {
                setPriority(selected);
              }}
              itemsPath="$..priorities[*]"
              namePath="$"
              valuePath="$"
              label={
                <label
                  htmlFor="priority"
                  className="block text-sm font-bold text-gray-700 mb-2 mt-4"
                >
                  Priority
                </label>
              }
              isDisabled={!msProjectType}
              id="priority"
              rules={{
                required: "Please provide valid value"
              }}
            />
            <p className="text-red-600 text-sm">{errors.priority?.message}</p>
          </ConfigItem>
        </ConfigItem>
      </div>
      <div className="mb-4">
        <Controller
          control={control}
          name="title"
          rules={{
            required: "Please provide valid value"
          }}
          render={({ field }) => {
            const { onChange, value } = field;
            return (
              <TextInput
                label="Title"
                id="title"
                className="w-full"
                onChange={onChange}
                value={value}
              />
            );
          }}
        />
        <p className="text-red-600 text-sm">{errors.title?.message}</p>
      </div>
      <div className="mb-4">
        <Controller
          control={control}
          name="description"
          rules={{
            required: "Please provide valid value"
          }}
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
        <p className="text-red-600 text-sm">{errors.description?.message}</p>
      </div>
    </div>
  );
};
