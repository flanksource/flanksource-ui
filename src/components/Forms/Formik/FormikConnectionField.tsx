import { useQuery } from "@tanstack/react-query";
import { getAll } from "../../../api/schemaResources";
import { Icon } from "../../../ui/Icons/Icon";
import { Connection } from "../../Connections/ConnectionFormModal";
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
        api: "canary-checker",
        name: "Connections"
      });
      return (res.data as Connection[]) ?? [];
    },
    select: (connections) => {
      return connections.map((connection) => {
        return {
          label: connection.name,
          value: connection.id!,
          icon: <Icon className="h-5" name={connection.type} />
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
      className="flex flex-col space-y-2 py-2"
      options={connections}
      label={label}
      isLoading={isLoading}
      required={required}
      hint={hint}
    />
  );
}
