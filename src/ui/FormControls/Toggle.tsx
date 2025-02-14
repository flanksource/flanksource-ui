/* This example requires Tailwind CSS v2.0+ */
import { Switch } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  className?: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
  help?: string;
  label?: string;
  disabled?: boolean;
  hint?: string;
  labelClassName?: string;
} & Omit<React.ComponentProps<typeof Switch>, "value" | "onChange">;

export function Toggle({
  value = false,
  className = "flex items-center break-all",
  label,
  help,
  onChange = () => {},
  hint,
  labelClassName = "min-w-min text-wrap text-sm font-medium text-gray-700",
  ...props
}: Props) {
  return (
    <Switch.Group as="div" title={hint} className={className}>
      <Switch
        {...props}
        checked={value}
        onChange={onChange}
        className={classNames(
          value ? "bg-blue-600" : "bg-gray-200",
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            value ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          )}
        />
      </Switch>

      <Switch.Label as="span" className="ml-2">
        <span className={labelClassName}>{label}</span>
        <span className="text-sm text-gray-500">{help}</span>
      </Switch.Label>

      {help != null && (
        <Switch.Description as="span" className="text-sm text-gray-500">
          {help}
        </Switch.Description>
      )}
    </Switch.Group>
  );
}
