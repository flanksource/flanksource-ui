import clsx from "clsx";
import {
  Control,
  Controller,
  FieldErrorsImpl,
  UseFormSetValue
} from "react-hook-form";
import { TextInput } from "../../../../../ui/FormControls/TextInput";
import { AddResponderFormValues } from "../../AddResponders/AddResponder";

type ServiceNowProps = {
  control: Control;
  errors: FieldErrorsImpl<AddResponderFormValues>;
  setValue: UseFormSetValue<AddResponderFormValues>;
  defaultValues?: { [key: string]: any };
  values?: { [key: string]: any };
} & React.HTMLProps<HTMLDivElement>;

export const ServiceNow = ({
  control,
  errors,
  className,
  defaultValues,
  values,
  ...rest
}: ServiceNowProps) => {
  return (
    <div className={clsx(className)} {...rest}>
      <div className="mb-4">
        <Controller
          control={control}
          name="category"
          rules={{
            required: "Please provide valid value"
          }}
          render={({ field, fieldState: { isDirty } }) => {
            const { onChange, value } = field;
            return (
              <TextInput
                label="Category"
                id="category"
                className="w-full"
                onChange={onChange}
                value={isDirty ? value : defaultValues?.category}
                disabled={values?.category}
              />
            );
          }}
        />
        <p className="text-sm text-red-600">{errors.category?.message}</p>
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
