import {
  toastError,
  toastSuccess
} from "@flanksource-ui/components/Toast/toast";
import { Button } from "@flanksource-ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@flanksource-ui/components/ui/dialog";
import { Input } from "@flanksource-ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@flanksource-ui/components/ui/select";
import { Switch } from "@flanksource-ui/components/ui/switch";
import { useUser } from "@flanksource-ui/context";
import {
  deleteProperty,
  fetchProperties,
  saveProperty,
  updateProperty
} from "@flanksource-ui/api/services/properties";
import { formatJobName } from "@flanksource-ui/utils/common";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useMemo, useRef, useState } from "react";

type DisableProperty = {
  name: string;
  value: string;
};

type JobHistoryOverridesDialogProps = {
  open: boolean;
  jobName?: string;
  onOpenChange: (open: boolean) => void;
};

type OverrideField = {
  key: string;
  label: string;
  description: string;
  type: "string" | "number" | "switch" | "select";
};

const overrideFields: OverrideField[] = [
  {
    key: "schedule",
    label: "Schedule",
    description: "Cron expression that overrides the job's run schedule.",
    type: "string"
  },
  {
    key: "retention.success",
    label: "Retention Success",
    description: "Number of successful runs to retain in history.",
    type: "number"
  },
  {
    key: "retention.failed",
    label: "Retention Failed",
    description: "Number of failed runs to retain in history.",
    type: "number"
  },
  {
    key: "db-log-level",
    label: "Log Level",
    description: "Override SQL logging verbosity for this job.",
    type: "select"
  },
  {
    key: "disabled",
    label: "Disable",
    description:
      "Disable job execution before it starts and before history is recorded.",
    type: "switch"
  }
];

const supportedLogLevels = ["info", "debug", "trace", "warn", "error"] as const;
const EMPTY_PROPERTIES: DisableProperty[] = [];

const upsertProperty = async (
  name: string,
  value: string,
  userID?: string
): Promise<void> => {
  const payload = {
    name,
    value,
    created_by: userID
  };

  try {
    await saveProperty(payload);
    return;
  } catch (error) {
    const code = isAxiosError(error)
      ? (error.response?.data as { code?: string } | undefined)?.code
      : undefined;

    // If the property already exists, update it instead.
    if (code === "23505") {
      await updateProperty(payload);
      return;
    }

    throw error;
  }
};

const ignoreNotFound = (error: unknown) => {
  if (isAxiosError(error) && error.response?.status === 404) {
    return;
  }
  throw error;
};

export default function JobHistoryOverridesDialog({
  open,
  jobName,
  onOpenChange
}: JobHistoryOverridesDialogProps) {
  const user = useUser();

  const { data: properties } = useQuery({
    queryKey: ["job_history_overrides", "properties", jobName],
    queryFn: async () => {
      const response = await fetchProperties();
      return (response.data ?? []) as DisableProperty[];
    },
    enabled: open && !!jobName,
    staleTime: 0
  });

  const safeProperties = properties ?? EMPTY_PROPERTIES;

  const initialValues = useMemo(() => {
    const values: Record<string, string> = {};
    if (!jobName) {
      return values;
    }

    const prefix = `jobs.${jobName}.`;
    const byName = new Map(
      safeProperties.map((property) => [property.name, property.value])
    );

    for (const field of overrideFields) {
      if (field.key === "disabled") {
        values[field.key] =
          byName.get(`${prefix}disabled`) ??
          byName.get(`${prefix}disable`) ??
          "";
        continue;
      }

      values[field.key] = byName.get(`${prefix}${field.key}`) ?? "";
    }

    return values;
  }, [jobName, safeProperties]);

  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const wasOpenRef = useRef(open);

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      setValues(initialValues);
    }
    wasOpenRef.current = open;
  }, [initialValues, open]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!jobName) {
        return;
      }

      const prefix = `jobs.${jobName}.`;
      const operations: Promise<any>[] = [];

      for (const field of overrideFields) {
        const value = values[field.key] ?? "";

        if (field.key === "disabled") {
          const disabledName = `${prefix}disabled`;
          const legacyDisabledName = `${prefix}disable`;

          if (value === "") {
            operations.push(
              deleteProperty({ name: disabledName }).catch(ignoreNotFound),
              deleteProperty({ name: legacyDisabledName }).catch(ignoreNotFound)
            );
          } else {
            operations.push(upsertProperty(disabledName, value, user.user?.id));
            operations.push(
              deleteProperty({ name: legacyDisabledName }).catch(ignoreNotFound)
            );
          }

          continue;
        }

        const propertyName = `${prefix}${field.key}`;
        if (value === "") {
          operations.push(
            deleteProperty({ name: propertyName }).catch(ignoreNotFound)
          );
        } else {
          operations.push(upsertProperty(propertyName, value, user.user?.id));
        }
      }

      const results = await Promise.allSettled(operations);
      const failures = results.filter((result) => result.status === "rejected");
      if (failures.length > 0) {
        throw new Error("Failed to save one or more overrides");
      }
    },
    onSuccess: () => {
      toastSuccess("Job overrides updated");
      onOpenChange(false);
    },
    onError: (error) => {
      toastError((error as Error).message);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Edit Job Overrides {jobName ? `- ${formatJobName(jobName)}` : ""}
          </DialogTitle>
          <DialogDescription>
            Configure property overrides for this job. Leave a field empty to
            use the default behavior.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {overrideFields.map((field) => (
            <div className="grid grid-cols-3 items-start gap-4" key={field.key}>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  {field.description}
                </p>
              </div>

              <div className="col-span-2">
                {field.type === "switch" ? (
                  <Switch
                    className="data-[state=checked]:bg-red-600"
                    checked={values[field.key] === "true"}
                    onCheckedChange={(checked) => {
                      setValues((current) => ({
                        ...current,
                        [field.key]: checked ? "true" : ""
                      }));
                    }}
                  />
                ) : field.type === "select" ? (
                  <Select
                    value={values[field.key] || "__default__"}
                    onValueChange={(value) => {
                      setValues((current) => ({
                        ...current,
                        [field.key]: value === "__default__" ? "" : value
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Default" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__default__">Default</SelectItem>
                      {supportedLogLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type={field.type === "number" ? "number" : "text"}
                    value={values[field.key] ?? ""}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setValues((current) => ({
                        ...current,
                        [field.key]: nextValue
                      }));
                    }}
                    placeholder="Default"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saveMutation.isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isLoading}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
