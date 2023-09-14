import { useQuery } from "@tanstack/react-query";
import { getAll } from "../../../api/schemaResources";
import { toastError } from "../../Toast/toast";
import FormikSelectDropdown from "./FormikSelectDropdown";

type Props = {
  name: string;
  label?: string;
  required?: boolean;
  hint?: string;
};

export default function FormikConnectionField({
  name,
  label,
  required = false,
  hint
}: Props) {
  const { data: connections = [], isLoading } = useQuery({
    queryKey: ["connections", "canary-checker"],
    queryFn: async () => {
      const res = await getAll({
        table: "connections",
        api: "canary-checker"
      });
      return res.data ?? [];
    },
    select: (connections) => {
      return connections.map((connection) => {
        return {
          label: connection.name,
          value: connection.id
        };
      });
    },
    onError: (err: Error) => {
      toastError((err as Error).message);
    }
  });

  return (
    <FormikSelectDropdown
      name={name}
      className="h-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
      options={connections}
      label={label}
      isLoading={isLoading}
      required={required}
      hint={hint}
    />
  );
}
