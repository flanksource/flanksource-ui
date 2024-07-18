import clsx from "clsx";
import {
  Control,
  Controller,
  FieldErrorsImpl,
  UseFormSetValue
} from "react-hook-form";
import { TextInput } from "../../../../../ui/FormControls/TextInput";
import { AddResponderFormValues } from "../../AddResponders/AddResponder";

type PersonProps = {
  control: Control;
  errors: FieldErrorsImpl<AddResponderFormValues>;
  setValue: UseFormSetValue<AddResponderFormValues>;
  defaultValues?: { [key: string]: any };
  values?: { [key: string]: any };
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
      <p className="text-sm text-red-600">{errors.person?.message ?? ""}</p>
    </div>
  );
};
