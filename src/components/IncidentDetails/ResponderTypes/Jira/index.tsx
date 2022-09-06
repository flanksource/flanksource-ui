import clsx from "clsx";
import { useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  SetFieldValue,
  UseFormSetValue
} from "react-hook-form";
import { ConfigItem } from "../../../ConfigItem";
import { TextInput } from "../../../TextInput";
import { AddResponderFormValues } from "../../AddResponder";

type JiraProps = {
  control: Control;
  errors: FieldErrors;
  setValue: UseFormSetValue<AddResponderFormValues>;
} & React.HTMLProps<HTMLDivElement>;

export const Jira = ({
  control,
  errors,
  setValue,
  className,
  ...rest
}: JiraProps) => {
  const [jiraProjectType, setJiraProjectType] = useState();
  const [jiraProject, setJiraProject] = useState();
  const [issueType, setIssueType] = useState();
  const [priority, setPriority] = useState();

  return (
    <div className={clsx(className)} {...rest}>
      <div className="mb-4">
        <ConfigItem
          type="Jira"
          control={control}
          name="configType"
          autoFetch={true}
          onSelect={(e: any) => {
            setJiraProjectType(e);
            setValue("project", "");
            setValue("issueType", "");
          }}
          label={
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Jira Config Type
            </label>
          }
          value={jiraProjectType}
          id="config-type"
          rules={{
            required: "Please provide valid value"
          }}
        >
          <p className="text-red-600 text-sm">{errors?.configType?.message}</p>
          <ConfigItem
            type="Jira"
            control={control}
            name="project"
            value={jiraProject}
            autoFetch={false}
            onSelect={(selected) => {
              setJiraProject(selected);
              setValue("issueType", "");
            }}
            itemsPath="$..projects[*]"
            namePath="$.name"
            valuePath="$.key"
            label={
              <label
                htmlFor="project"
                className="block text-sm font-bold text-gray-700 mb-2 mt-4"
              >
                Project
              </label>
            }
            isDisabled={!jiraProjectType}
            id="project"
            rules={{
              required: "Please provide valid value"
            }}
          >
            <p className="text-red-600 text-sm">{errors?.project?.message}</p>
            <ConfigItem
              type="Jira"
              control={control}
              name="issueType"
              value={issueType}
              autoFetch={false}
              onSelect={(selected) => {
                setIssueType(selected);
              }}
              itemsPath="$..issueTypes[*]"
              namePath="$"
              valuePath="$"
              label={
                <label
                  htmlFor="issueType"
                  className="block text-sm font-bold text-gray-700 mb-2 mt-4"
                >
                  Issue Type
                </label>
              }
              isDisabled={!jiraProject}
              id="issueType"
              rules={{
                required: "Please provide valid value"
              }}
            />
            <p className="text-red-600 text-sm">{errors.issueType?.message}</p>
            <ConfigItem
              type="Jira"
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
              isDisabled={!jiraProject}
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
          name="summary"
          rules={{
            required: "Please provide valid value"
          }}
          render={({ field }) => {
            const { onChange, value } = field;
            return (
              <TextInput
                label="Summary"
                id="summary"
                className="w-full"
                onChange={onChange}
                value={value}
              />
            );
          }}
        />
        <p className="text-red-600 text-sm">{errors.summary?.message}</p>
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
