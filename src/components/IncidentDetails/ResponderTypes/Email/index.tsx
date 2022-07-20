import clsx from "clsx";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { TextInput } from "../../../TextInput";

type EmailProps = {
  control: Control;
  errors: FieldErrors;
} & React.HTMLProps<HTMLDivElement>;

export const Email = ({ control, errors, className, ...rest }: EmailProps) => {
  return (
    <div className={clsx(className)} {...rest}>
      <div className="mb-4">
        <Controller
          control={control}
          name="to"
          rules={{
            required: "Please provide valid value"
          }}
          render={({ field }) => {
            const { onChange, value } = field;
            return (
              <TextInput
                label="To"
                id="to"
                className="w-full"
                onChange={onChange}
                value={value}
              />
            );
          }}
        />
        <p className="text-red-600 text-sm">{errors.to?.message}</p>
      </div>
      <div className="mb-4">
        <Controller
          control={control}
          name="subject"
          rules={{
            required: "Please provide valid value"
          }}
          render={({ field }) => {
            const { onChange, value } = field;
            return (
              <TextInput
                label="Subject"
                id="subject"
                className="w-full"
                onChange={onChange}
                value={value}
              />
            );
          }}
        />
        <p className="text-red-600 text-sm">{errors.subject?.message}</p>
      </div>
      <div className="mb-4">
        <Controller
          control={control}
          name="body"
          rules={{
            required: "Please provide valid value"
          }}
          render={({ field }) => {
            const { onChange, value } = field;
            return (
              <TextInput
                label="Body"
                id="body"
                className="w-full"
                onChange={onChange}
                value={value}
              />
            );
          }}
        />
        <p className="text-red-600 text-sm">{errors.body?.message}</p>
      </div>
    </div>
  );
};
