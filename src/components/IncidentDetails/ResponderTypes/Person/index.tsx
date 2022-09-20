import clsx from "clsx";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue
} from "react-hook-form";
import { TextInput } from "../../../TextInput";
import { AddResponderFormValues } from "../../AddResponder";

type PersonProps = {
  control: Control;
  errors: FieldErrors;
  setValue: UseFormSetValue<AddResponderFormValues>;
  defaultValues: { [key: string]: any };
  values: { [key: string]: any };
} & React.HTMLProps<HTMLDivElement>;

export const Person = ({
  control,
  errors,
  className,
  defaultValues,
  values,
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
        render={({ field, fieldState: { isDirty } }) => {
          const { onChange, value } = field;
          return (
            <TextInput
              label="Person"
              id="person"
              className="w-full"
              onChange={onChange}
              value={isDirty ? value : defaultValues?.person}
              disabled={values?.person}
            />
          );
        }}
      />
      <p className="text-red-600 text-sm">{errors.person?.message}</p>
    </div>
  );
};
