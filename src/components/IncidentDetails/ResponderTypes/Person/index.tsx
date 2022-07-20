import clsx from "clsx";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { TextInput } from "../../../TextInput";

type PersonProps = {
  control: Control;
  errors: FieldErrors;
} & React.HTMLProps<HTMLDivElement>;

export const Person = ({
  control,
  errors,
  className,
  ...rest
}: PersonProps) => {
  return (
    <div className={clsx("mb-4", className)} {...rest}>
      <Controller
        control={control}
        name="person"
        rules={{
          required: "Please provide valid value"
        }}
        render={({ field }) => {
          const { onChange, value } = field;
          return (
            <TextInput
              label="Person"
              id="person"
              className="w-full"
              onChange={onChange}
              value={value}
            />
          );
        }}
      />
      <p className="text-red-600 text-sm">{errors.person?.message}</p>
    </div>
  );
};
