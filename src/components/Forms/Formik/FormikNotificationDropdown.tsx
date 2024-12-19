import { useMemo } from "react";
import FormikSelectDropdown from "./FormikSelectDropdown";
import { useGetAllNotifications } from "@flanksource-ui/api/query-hooks/useNotificationsQuery";

type FormikEventsDropdownProps = {
  name: string;
  label?: string;
  required?: boolean;
  hint?: string;
  className?: string;
};

export default function FormikNotificationDropdown({
  name,
  label,
  required = false,
  hint,
  className = "flex flex-col space-y-2 py-2"
}: FormikEventsDropdownProps) {
  const { data: notificationRules, isLoading } = useGetAllNotifications();

  const options = useMemo(
    () =>
      notificationRules?.map((rule) => ({
        label: rule.name,
        value: rule.id
      })),
    [notificationRules]
  );

  return (
    <FormikSelectDropdown
      name={name}
      className={className}
      options={options}
      label={label}
      isLoading={isLoading}
      required={required}
      hint={hint}
    />
  );
}
