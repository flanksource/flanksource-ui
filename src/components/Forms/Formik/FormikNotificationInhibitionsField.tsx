import { NotificationInhibition } from "@flanksource-ui/api/types/notifications";
import { useFormikContext } from "formik";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { FaPlus, FaTrash } from "react-icons/fa";
import FormikTextInput from "./FormikTextInput";
import FormikAutocompleteDropdown from "./FormikAutocompleteDropdown";
import FormikNumberInput from "./FormikNumberInput";
import { FormikCodeEditor } from "./FormikCodeEditor";
import ErrorMessage from "@flanksource-ui/ui/FormControls/ErrorMessage";
import { FormikErrors } from "formik";
import { Toggle } from "../../../ui/FormControls/Toggle";

type FormikNotificationInhibitionsFieldProps = {
  name: string;
  label?: string;
  hint?: string;
};

const directionOptions = [
  { label: "Outgoing", value: "outgoing" },
  { label: "Incoming", value: "incoming" },
  { label: "All", value: "all" }
];

type FormValues = {
  [key: string]: NotificationInhibition[];
};

type FormErrors = {
  [key: string]: (FormikErrors<NotificationInhibition> & { to?: string })[];
};

const FormikNotificationInhibitionsField = ({
  name,
  label = "Inhibitions",
  hint = "Configure inhibition rules to prevent notification storms"
}: FormikNotificationInhibitionsFieldProps) => {
  const { values, setFieldValue, errors } = useFormikContext<FormValues>();

  const inhibitions = values[name] || [];
  const fieldErrors = errors as FormErrors;

  const addInhibition = () => {
    const newInhibition: NotificationInhibition = {
      direction: "outgoing",
      from: "",
      to: []
    };
    setFieldValue(name, [...inhibitions, newInhibition]);
  };

  const removeInhibition = (index: number) => {
    const newInhibitions = [...inhibitions];
    newInhibitions.splice(index, 1);
    setFieldValue(name, newInhibitions);
  };

  const updateInhibition = (
    index: number,
    field: keyof NotificationInhibition,
    value: string | number | boolean | string[] | undefined
  ) => {
    const newInhibitions = [...inhibitions];
    newInhibitions[index] = {
      ...newInhibitions[index],
      [field]: value
    };
    setFieldValue(name, newInhibitions);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          {hint && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
        </div>
        <Button
          icon={<FaPlus />}
          onClick={addInhibition}
          className="btn-primary"
        >
          Add Inhibition
        </Button>
      </div>

      {inhibitions.map((inhibition, index) => (
        <div key={index} className="rounded-lg border border-gray-200 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium">Inhibition Rule {index + 1}</h3>
            <Button
              icon={<FaTrash />}
              onClick={() => removeInhibition(index)}
              className="btn-danger"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormikAutocompleteDropdown
              name={`${name}.${index}.direction`}
              options={directionOptions}
              label="Direction"
              hint="Specify the traversal direction for related resources"
            />

            <FormikTextInput
              name={`${name}.${index}.from`}
              label="From Resource Type"
              hint="e.g., Kubernetes::Pod"
            />

            <div className="col-span-2">
              <FormikCodeEditor
                fieldName={`${name}.${index}.to`}
                format="yaml"
                label="To Resource Types"
                hint="List of resource types to traverse to (e.g., ['Kubernetes::Deployment', 'Kubernetes::ReplicaSet'])"
                lines={5}
                className="flex h-32 flex-col"
              />
              {fieldErrors?.[name]?.[index]?.to && (
                <ErrorMessage
                  message={fieldErrors[name][index].to}
                  className="mt-1"
                />
              )}
            </div>

            <div className="flex items-end gap-4">
              <FormikNumberInput
                value={inhibition.depth}
                onChange={(value) => updateInhibition(index, "depth", value)}
                label="Depth"
                hint="Number of levels to traverse"
              />
              <div className="flex flex-col">
                <Toggle
                  onChange={(value: boolean) => {
                    setFieldValue(`${name}.${index}.soft`, value);
                  }}
                  label="Soft Relationships"
                  value={!!inhibition.soft}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Use soft relationships for traversal
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FormikNotificationInhibitionsField;
