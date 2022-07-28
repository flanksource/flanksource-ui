import clsx from "clsx";
import { useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { ConfigItem } from "../../../ConfigItem";
import { TextInput } from "../../../TextInput";

type JiraProps = {
  control: Control;
  errors: FieldErrors;
} & React.HTMLProps<HTMLDivElement>;

export const Jira = ({ control, errors, className, ...rest }: JiraProps) => {
  const [jiraProjectType, setJiraProjectType] = useState();
  const [jiraProject, setJiraProject] = useState();

  return (
    <div className={clsx(className)} {...rest}>
      <div className="mb-4">
        <Controller
          control={control}
          name="project"
          rules={{
            required: "Please provide valid value"
          }}
          render={({ field }) => {
            const { onChange } = field;
            return (
              <ConfigItem
                type="Jira"
                autoFetch={true}
                onSelect={setJiraProjectType}
                label={
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Jira Config Type
                  </label>
                }
                value={jiraProjectType}
                id="config-type"
              >
                <ConfigItem
                  type="Jira"
                  value={jiraProject}
                  autoFetch={false}
                  onSelect={(selected) => {
                    setJiraProject(selected);
                    onChange(selected.value);
                  }}
                  itemsPath="$..projects[*]"
                  namePath="$.name"
                  valuePath="$.name"
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
                />
              </ConfigItem>
            );
          }}
        />
        <p className="text-red-600 text-sm">{errors.project?.message}</p>
      </div>
      <div className="mb-4">
        <Controller
          control={control}
          name="issueType"
          rules={{
            required: "Please provide valid value"
          }}
          render={({ field }) => {
            const { onChange, value } = field;
            return (
              <TextInput
                label="Issue Type"
                id="issueType"
                className="w-full"
                onChange={onChange}
                value={value}
              />
            );
          }}
        />
        <p className="text-red-600 text-sm">{errors.issueType?.message}</p>
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
