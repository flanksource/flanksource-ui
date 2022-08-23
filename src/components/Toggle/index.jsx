/* This example requires Tailwind CSS v2.0+ */
import { Switch } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Toggle({ value = false, className, label, help, onChange }) {
  return (
    <Switch.Group
      as="div"
      className={`flex items-center break-all ${className}`}
    >
      <Switch
        checked={value}
        onChange={onChange}
        className={classNames(
          value ? "bg-blue-600" : "bg-gray-200",
          "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            value ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
          )}
        />
      </Switch>

      <Switch.Label as="span" className="ml-3">
        <span className="text-sm font-medium text-gray-700 ">{label}</span>
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
