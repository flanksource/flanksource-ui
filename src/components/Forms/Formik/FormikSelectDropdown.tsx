import { useField } from "formik";
import React, {
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import Select, { components } from "react-select";

export type FormikSelectDropdownOption = {
  label: React.ReactNode;
  value: string;
  icon?: React.ReactNode;
  search?: string;
};

type Props = {
  name: string;
  label?: string;
  required?: boolean;
  hint?: string;
  options?: FormikSelectDropdownOption[];
} & Omit<ComponentProps<typeof Select>, "option">;

export default function FormikSelectDropdown({
  name,
  label,
  required = false,
  hint,
  options,
  className = "flex flex-col py-2",
  ...props
}: Props) {
  const [isTouched, setIsTouched] = useState(false);

  const [field, meta] = useField<string | string[]>({
    name,
    type: "text",
    required,
    validate: useCallback(
      (value: string) => {
        if (required && !value) {
          return "This field is required";
        }
      },
      [required]
    )
  });

  const value = useMemo(() => {
    if (props.isMulti && Array.isArray(field.value)) {
      const x = options?.filter((item) => field.value.includes(item.value));
      return x;
    }
    return options?.filter((item) => item.value === field.value);
  }, [field.value, options, props.isMulti]);

  useEffect(() => {
    setIsTouched(isTouched || meta.touched || meta.initialTouched);
  }, [isTouched, meta.initialTouched, meta.touched]);

  return (
    <div className={className}>
      {label && <label className="form-label">{label}</label>}
      <Select
        name={name}
        className="h-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        options={options}
        value={value}
        onChange={(value: any) => {
          field.onChange({
            target: {
              name: field.name,
              value: Array.isArray(value)
                ? value.map((item) => item.value)
                : value.value
            }
          });
        }}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 })
        }}
        menuPosition={"fixed"}
        menuShouldBlockScroll={true}
        onBlur={(event) => {
          field.onBlur(event);
          setIsTouched(true);
        }}
        onFocus={(event) => {
          field.onBlur(event);
          setIsTouched(true);
        }}
        components={{
          Option: ({ children, ...props }) => {
            return (
              <components.Option {...props}>
                <div className="flex flex-row items-center gap-2 text-sm">
                  {(props.data as any).icon && (
                    // eslint-disable-next-line react/jsx-no-useless-fragment
                    <>{(props.data as any).icon}</>
                  )}
                  <div className="flex-1 break-before-all text-ellipsis whitespace-nowrap">
                    {children}
                  </div>
                </div>
              </components.Option>
            );
          },
          SingleValue: ({ children, ...props }) => {
            return (
              <components.SingleValue {...props}>
                <div className="flex flex-row items-center gap-2">
                  {(props.data as any).icon && (
                    // eslint-disable-next-line react/jsx-no-useless-fragment
                    <>{(props.data as any).icon}</>
                  )}
                  <div className="flex-1 break-after-all text-ellipsis whitespace-nowrap">
                    {children}
                  </div>
                </div>
              </components.SingleValue>
            );
          }
        }}
        {...props}
      />
      {hint && <p className="text-sm text-gray-500">{hint}</p>}
      {isTouched && meta.error ? (
        <p className="w-full py-1 text-sm text-red-500">{meta.error}</p>
      ) : null}
    </div>
  );
}
