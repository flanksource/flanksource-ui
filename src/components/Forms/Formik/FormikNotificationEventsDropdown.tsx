import { notificationEvents } from "../../Notifications/notificationsTableColumns";
import FormikSelectDropdown from "./FormikSelectDropdown";

type FormikEventsDropdownProps = {
  name: string;
  label: string;
  required?: boolean;
  hint?: string;
};

export default function FormikNotificationEventsDropdown({
  name,
  label = "Event",
  required = false,
  hint
}: FormikEventsDropdownProps) {
  return (
    <FormikSelectDropdown
      name={name}
      className="h-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      options={notificationEvents}
      label={label}
      required={required}
      hint={hint}
      isMulti
    />
  );
}
