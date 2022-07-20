import clsx from "clsx";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { TextInput } from "../../../TextInput";

type JiraProps = {
  control: Control;
  errors: FieldErrors;
} & React.HTMLProps<HTMLDivElement>;

export const Jira = ({ control, errors, className, ...rest }: JiraProps) => {
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
            const { onChange, value } = field;
            return (
              <TextInput
                label="Project"
                id="project"
                className="w-full"
                onChange={onChange}
                value={value}
              />
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
