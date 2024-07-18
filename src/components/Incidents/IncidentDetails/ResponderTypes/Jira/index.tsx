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

type JiraProps = {
  teamId: string;
  control: Control;
  errors: FieldErrorsImpl<AddResponderFormValues>;
  setValue: UseFormSetValue<AddResponderFormValues>;
  defaultValues?: { [key: string]: any } | undefined;
  values?: { [key: string]: any } | undefined;
} & React.HTMLProps<HTMLDivElement>;

export const Jira = ({
  teamId,
  control,
  errors,
  setValue,
  className,
  defaultValues,
  values,
  ...rest
}: JiraProps) => {
  const [jiraProjectType, setJiraProjectType] = useState();
  const [jiraProject, setJiraProject] = useState();
  const [issueType, setIssueType] = useState();
  const [priority, setPriority] = useState();
  const timerRef = useRef<any>();
  const [allValues, setAllValues] = useState<any>({});

  useEffect(() => {
    searchConfigs("jira", "")
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
        setJiraProjectType(item);
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
  }, [allValues, control, defaultValues, setValue, values]);

  return (
    <div className={clsx(className)} {...rest}>
      <div className="mb-4">
        <ConfigItem
          type="jira"
          control={control}
          name="configType"
          autoFetch={true}
          onSelect={(e: any) => {
            setJiraProjectType(e);
            setValue("project", "");
            setValue("issueType", "");
          }}
          label={<label className="form-label">Jira Instance</label>}
          value={jiraProjectType}
          id="config-type"
          isDisabled={jiraProjectType}
          rules={{
            required: "Please provide valid value"
          }}
        >
          <p className="text-sm text-red-600">{errors?.configType?.message}</p>
          <ConfigItem
            type="jira"
            control={control}
            name="project"
            value={
              control.getFieldState("project")?.isDirty
                ? jiraProject
                : values?.project || defaultValues?.project
            }
            autoFetch={false}
            onSelect={(selected) => {
              setJiraProject(selected);
              setValue("project", selected);
              setValue("issueType", "");
            }}
            itemsPath="$..projects[*]"
            namePath="$.name"
            valuePath="$.key"
            label={
              <label htmlFor="project" className="form-label mt-4">
                Project
              </label>
            }
            isDisabled={!jiraProjectType || values?.project}
            id="project"
            rules={{
              required: "Please provide valid value"
            }}
          >
            <p className="text-sm text-red-600">{errors?.project?.message}</p>
            <ConfigItem
              type="jira"
              control={control}
              name="issueType"
              value={
                control.getFieldState("issueType")?.isDirty
                  ? issueType
                  : values?.issueType || defaultValues?.issueType
              }
              autoFetch={false}
              onSelect={(selected) => {
                setIssueType(selected);
                setValue("issueType", selected);
              }}
              itemsPath="$..issueTypes[*]"
              namePath="$"
              valuePath="$"
              label={
                <label htmlFor="issueType" className="form-label mt-4">
                  Issue Type
                </label>
              }
              isDisabled={!jiraProject || values?.issueType}
              id="issueType"
              rules={{
                required: "Please provide valid value"
              }}
            />
            <p className="text-sm text-red-600">{errors.issueType?.message}</p>
            <ConfigItem
              type="jira"
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
              isDisabled={!jiraProject || values?.priority}
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
          name="summary"
          rules={{
            required: "Please provide valid value"
          }}
          render={({ field, fieldState: { isDirty } }) => {
            const { onChange, value } = field;
            return (
              <TextInput
                label="Summary"
                id="summary"
                className="w-full"
                onChange={onChange}
                value={isDirty ? value : defaultValues?.summary}
                disabled={values?.summary}
              />
            );
          }}
        />
        <p className="text-sm text-red-600">{errors.summary?.message}</p>
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
