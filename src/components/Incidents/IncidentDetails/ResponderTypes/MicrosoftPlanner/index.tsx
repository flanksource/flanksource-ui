import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import {
  Control,
  Controller,
  FieldErrorsImpl,
  UseFormSetValue
} from "react-hook-form";
import { searchConfigs } from "../../../../../api/services/configs";
import { TextInput } from "../../../../../ui/FormControls/TextInput";
import { ConfigItem } from "../../../../Configs/ConfigItem";
import { AddResponderFormValues } from "../../AddResponders/AddResponder";

type MicrosoftProps = {
  teamId: string;
  control: Control;
  errors: FieldErrorsImpl<AddResponderFormValues>;
  setValue: UseFormSetValue<AddResponderFormValues>;
  defaultValues?: { [key: string]: any };
  values?: { [key: string]: any };
} & React.HTMLProps<HTMLDivElement>;

export const MicrosoftPlanner = ({
  teamId,
  control,
  errors,
  setValue,
  className,
  defaultValues,
  values,
  ...rest
}: MicrosoftProps) => {
  const [msProjectType, setMsProjectType] = useState();
  const [planId, setPlanId] = useState();
  const [bucketId, setBucketId] = useState();
  const [priority, setPriority] = useState();
  const timerRef = useRef<any>();
  const [allValues, setAllValues] = useState<any>({});

  useEffect(() => {
    searchConfigs("ms_planner", "")
      .then(({ data }: any) => {
        const item = (data || [])
          .map((item: any) => ({
            ...item,
            value: item.id,
            label: item.name || item.external_id
          }))
          .find((v: any) => {
            return v.external_id.includes(teamId);
          });
        setValue("configType", item);
        setMsProjectType(item);
      })
      .catch((err) => {});
  }, [setValue, teamId]);

  useEffect(() => {
    const obj = {
      ...(values || {}),
      ...(defaultValues || {})
    };
    const previous = allValues;
    setAllValues(obj);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      Object.keys(obj).forEach((key: any) => {
        if (
          !control.getFieldState(key).isDirty &&
          obj[key] &&
          previous[key] !== obj[key]
        ) {
          setValue(key, obj[key]);
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, values]);

  return (
    <div className={clsx(className)} {...rest}>
      <div className="mb-4">
        <ConfigItem
          type="ms_planner"
          control={control}
          name="configType"
          autoFetch={true}
          onSelect={(e: any) => {
            setMsProjectType(e);
            setValue("project", "");
            setValue("issueType", "");
          }}
          label={
            <label className="form-label">Microsoft Planner Instance</label>
          }
          value={msProjectType}
          isDisabled={msProjectType}
          id="config-type"
          rules={{
            required: "Please provide valid value"
          }}
        >
          <p className="text-sm text-red-600">{errors?.configType?.message}</p>
          <ConfigItem
            type="ms_planner"
            control={control}
            name="plan_id"
            value={
              control.getFieldState("plan_id")?.isDirty
                ? planId
                : values?.plan_id || defaultValues?.plan_id
            }
            autoFetch={false}
            onSelect={(selected) => {
              setPlanId(selected);
              setValue("plan_id", selected);
              setValue("bucket_id", "");
            }}
            itemsPath="$..plans[*]"
            namePath="$.name"
            valuePath="$.id"
            label={
              <label htmlFor="plan_id" className="form-label mt-4">
                Plan ID
              </label>
            }
            isDisabled={!msProjectType}
            id="plan_id"
            rules={{
              required: "Please provide valid value"
            }}
          >
            <p className="text-sm text-red-600">{errors?.plan_id?.message}</p>
            <ConfigItem
              type="ms_planner"
              control={control}
              name="bucket_id"
              value={
                control.getFieldState("bucket_id")?.isDirty
                  ? bucketId
                  : values?.bucket_id || defaultValues?.bucket_id
              }
              autoFetch={false}
              onSelect={(selected) => {
                setBucketId(selected);
                setValue("bucket_id", selected);
              }}
              itemsPath="$..buckets[*]"
              namePath="$.name"
              valuePath="$.id"
              label={
                <label htmlFor="bucket_id" className="form-label mt-4">
                  Bucket ID
                </label>
              }
              isDisabled={!msProjectType}
              id="bucket_id"
              rules={{
                required: "Please provide valid value"
              }}
            />
            <p className="text-sm text-red-600">{errors.bucket_id?.message}</p>
            <ConfigItem
              type="ms_planner"
              control={control}
              name="priority"
              value={
                control.getFieldState("priority")?.isDirty
                  ? priority
                  : values?.priority || defaultValues?.priority
              }
              autoFetch={false}
              onSelect={(selected) => {
                setPriority(selected);
                setValue("priority", selected);
              }}
              itemsPath="$..priorities[*]"
              namePath="$"
              valuePath="$"
              label={
                <label htmlFor="priority" className="form-label mt-4">
                  Priority
                </label>
              }
              isDisabled={!msProjectType}
              id="priority"
              rules={{
                required: "Please provide valid value"
              }}
            />
            <p className="text-sm text-red-600">{errors.priority?.message}</p>
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
          render={({ field, fieldState: { isDirty } }) => {
            const { onChange, value } = field;
            return (
              <TextInput
                label="Title"
                id="title"
                className="w-full"
                onChange={onChange}
                value={isDirty ? value : defaultValues?.title}
                disabled={values?.title}
              />
            );
          }}
        />
        <p className="text-sm text-red-600">{errors.title?.message}</p>
      </div>
      <div className="mb-4">
        <Controller
          control={control}
          name="description"
          rules={{
            required: "Please provide valid value"
          }}
          render={({ field, fieldState: { isDirty } }) => {
            const { onChange, value } = field;
            return (
              <TextInput
                label="Description"
                id="description"
                className="w-full"
                onChange={onChange}
                value={isDirty ? value : defaultValues?.description}
                disabled={values?.description}
              />
            );
          }}
        />
        <p className="text-sm text-red-600">{errors.description?.message}</p>
      </div>
    </div>
  );
};
