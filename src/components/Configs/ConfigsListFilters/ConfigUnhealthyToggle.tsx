import { useField } from "formik";
import { Toggle } from "@flanksource-ui/ui/FormControls/Toggle";

export function ConfigUnhealthyToggle() {
  const [healthField, healthMeta, healthHelpers] = useField("health");
  const [unhealthyField] = useField({
    name: "showUnhealthy"
  });

  const handleToggle = (checked: boolean) => {
    if (checked) {
      // When toggled on, set the health filter to show unhealthy and warning resources
      healthHelpers.setValue("unhealthy:1,warning:1");
    } else {
      // When toggled off, clear the health filter
      healthHelpers.setValue(undefined);
    }
  };

  return (
    <Toggle
      className="mr-2 flex items-center"
      label="Unhealthy Only"
      hint="Show only unhealthy resources"
      value={
        // Check if we're filtering specifically for unhealthy and warning statuses
        healthField.value === "unhealthy:1,warning:1" ||
        healthField.value === "warning:1,unhealthy:1"
      }
      onChange={handleToggle}
    />
  );
}