import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getScrapePlugins, createScrapePlugin, updateScrapePlugin, deleteScrapePlugin } from "../../../api/services/plugins";
import { ScrapePlugin } from "../../../api/types/plugins";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { Modal } from "@flanksource-ui/ui/Modal/Modal";

// NOTE: Fallback DataTable implementation (uses simple table for now)
function SimpleDataTable({ columns, data, isLoading }) {
  return (
    <div className="overflow-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="p-2 border-b text-left font-semibold">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td colSpan={columns.length} className="text-center p-2">Loading...</td></tr>
          ) : (
            data.length === 0 ? (
              <tr><td colSpan={columns.length} className="text-center p-2">No plugins found.</td></tr>
            ) : (
              data.map((row, ridx) => (
                <tr key={row.id || ridx}>
                  {columns.map((col, cidx) =>
                    <td key={cidx} className="p-2 border-b">
                      {col.cell ? col.cell({ row }) : row[col.accessorKey]}
                    </td>
                  )}
                </tr>
              ))
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

const columns = [
  { header: "Name", accessorKey: "name" },
  { header: "Namespace", accessorKey: "namespace" },
  { header: "Source", accessorKey: "source" },
  { header: "Created By", accessorKey: "created_by" },
  { header: "Created At", accessorKey: "created_at" },
];

type EditablePlugin = Partial<ScrapePlugin> & { id?: string };

const defaultPlugin: EditablePlugin = {
  name: "",
  namespace: "",
  spec: {},
  source: "",
};

const PluginsPage = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<EditablePlugin | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["plugins"],
    queryFn: getScrapePlugins,
  });

  const mutationCreate = useMutation({
    mutationFn: createScrapePlugin,
    onSuccess: () => {
      queryClient.invalidateQueries(["plugins"]);
      setOpen(false);
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: ({ id, ...update }: EditablePlugin) => updateScrapePlugin(id!, update),
    onSuccess: () => {
      queryClient.invalidateQueries(["plugins"]);
      setOpen(false);
      setEditing(null);
    },
  });

  const mutationDelete = useMutation({
    mutationFn: (id: string) => deleteScrapePlugin(id),
    onSuccess: () => queryClient.invalidateQueries(["plugins"]),
  });

  const handleEdit = useCallback((plugin: ScrapePlugin) => {
    setEditing(plugin);
    setOpen(true);
  }, []);

  const handleDelete = useCallback((plugin: ScrapePlugin) => {
    if (window.confirm(`Delete plugin "${plugin.name}"?`)) {
      mutationDelete.mutate(plugin.id);
    }
  }, [mutationDelete]);

  const handleSave = (plugin: EditablePlugin) => {
    if (plugin.id) {
      mutationUpdate.mutate(plugin as EditablePlugin);
    } else {
      mutationCreate.mutate(plugin as EditablePlugin);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Scrape Plugins</h1>
        <Button onClick={() => { setEditing(null); setOpen(true); }}>Add Plugin</Button>
      </div>

      <SimpleDataTable
        isLoading={isLoading}
        columns={[
          ...columns,
          {
            header: "Actions",
            cell: ({ row }) => (
              <div className="flex gap-2">
                <Button size="xs" variant="ghost" onClick={() => handleEdit(row)}>Edit</Button>
                <Button size="xs" variant="danger" onClick={() => handleDelete(row)}>Delete</Button>
              </div>
            ),
          }
        ]}
        data={data}
      />

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Scrape Plugin" : "Add Scrape Plugin"}>
        <PluginForm
          initial={editing || defaultPlugin}
          onSave={handleSave}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    </div>
  );
};

type PluginFormProps = {
  initial: EditablePlugin;
  onSave: (plugin: EditablePlugin) => void;
  onCancel: () => void;
};

function PluginForm({ initial, onSave, onCancel }: PluginFormProps) {
  const [plugin, setPlugin] = useState<EditablePlugin>(initial);

  // If initial changes (edit -> add), update state
  React.useEffect(() => { setPlugin(initial); }, [initial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPlugin({ ...plugin, [name]: value });
  };

  // For advanced spec editing, consider a code editor in the future
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={e => { e.preventDefault(); onSave(plugin); }}
    >
      <label>
        Name
        <input name="name" value={plugin.name || ""} onChange={handleChange} className="input" required />
      </label>
      <label>
        Namespace
        <input name="namespace" value={plugin.namespace || ""} onChange={handleChange} className="input" required />
      </label>
      <label>
        Source
        <input name="source" value={plugin.source || ""} onChange={handleChange} className="input" />
      </label>
      <label>
        Spec (JSON)
        <textarea
          name="spec"
          value={typeof plugin.spec === "string" ? plugin.spec : JSON.stringify(plugin.spec ?? {}, null, 2)}
          onChange={e => {
            try {
              setPlugin({ ...plugin, spec: JSON.parse(e.target.value) });
            } catch {
              setPlugin({ ...plugin, spec: e.target.value });
            }
          }}
          className="input font-mono min-h-[80px]"
        />
      </label>
      <div className="flex gap-2 justify-end">
        <Button type="button" onClick={onCancel} variant="secondary">Cancel</Button>
        <Button type="submit">{plugin.id ? "Update" : "Create"}</Button>
      </div>
    </form>
  );
}

export default PluginsPage;