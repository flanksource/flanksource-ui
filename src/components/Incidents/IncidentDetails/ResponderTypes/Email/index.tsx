import clsx from "clsx";
import {
  Control,
  Controller,
  FieldErrorsImpl,
  UseFormSetValue
} from "react-hook-form";
import { TextInput } from "../../../../../ui/FormControls/TextInput";
import { AddResponderFormValues } from "../../AddResponders/AddResponder";

type EmailProps = {
  control: Control;
  errors: FieldErrorsImpl<AddResponderFormValues>;
  setValue: UseFormSetValue<AddResponderFormValues>;
  defaultValues?: { [key: string]: any };
  values?: { [key: string]: any };
} & React.HTMLProps<HTMLDivElement>;

export const Email = ({
  control,
  errors,
  className,
  defaultValues,
  values,
  ...rest
}: EmailProps) => {
  return (
    <div className={clsx(className)} {...rest}>
      <div className="mb-4">
        <Controller
          control={control}
          name="to"
          rules={{
            required: "Please provide valid value"
          }}
          render={({ field, fieldState: { isDirty } }) => {
            const { onChange, value } = field;
            return (
              <TextInput
                label="To"
                id="to"
                className="w-full"
                onChange={onChange}
                value={isDirty ? value : defaultValues?.to}
                disabled={values?.to}
              />
            );
          }}
        />
        <p className="text-sm text-red-600">{errors.to?.message}</p>
      </div>
      <div className="mb-4">
        <Controller
          control={control}
          name="subject"
          rules={{
            required: "Please provide valid value"
          }}
          render={({ field, fieldState: { isDirty } }) => {
            const { onChange, value } = field;
            return (
              <TextInput
                label="Subject"
                id="subject"
                className="w-full"
                onChange={onChange}
                value={isDirty ? value : defaultValues?.subject}
                disabled={values?.subject}
              />
            );
          }}
        />
        <p className="text-sm text-red-600">{errors.subject?.message}</p>
      </div>
      <div className="mb-4">
        <Controller
          control={control}
          name="body"
          rules={{
            required: "Please provide valid value"
          }}
          render={({ field, fieldState: { isDirty } }) => {
            const { onChange, value } = field;
            return (
              <TextInput
                label="Body"
                id="body"
                className="w-full"
                onChange={onChange}
                value={isDirty ? value : defaultValues?.body}
                disabled={values?.body}
              />
            );
          }}
        />
        <p className="text-sm text-red-600">{errors.body?.message}</p>
      </div>
    </div>
  );
};
