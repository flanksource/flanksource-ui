import { useEffect, useState } from "react";
import FormikAutocompleteDropdown from "./FormikAutocompleteDropdown";
import { getAll } from "../../../api/schemaResources";
import { toastError } from "../../Toast/toast";

type Props = {
  name: string;
  label: string;
  required?: boolean;
};

export default function FormikConnectionField({
  name,
  label,
  required
}: Props) {
  const [connections, setConnections] = useState<
    { label: string; value: string }[]
  >([]);

  async function fetchConnections() {
    try {
      const response = await getAll({
        table: "connections",
        api: "canary-checker"
      });
      if (response.data) {
        setConnections(
          response.data.map((item) => {
            return {
              label: item.name,
              value: item.id
            };
          })
        );
        return;
      }
      toastError(response.statusText);
    } catch (ex) {
      toastError((ex as Error).message);
    }
  }

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <FormikAutocompleteDropdown
      name={name}
      label={label}
      required={required}
      options={connections}
    />
  );
}
