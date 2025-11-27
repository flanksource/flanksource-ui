import {
  deleteNotificationSilence,
  silenceNotification,
  updateNotificationSilence
} from "@flanksource-ui/api/services/notifications";
import {
  SilenceSaveRequest,
  SilenceSaveFormValues
} from "@flanksource-ui/api/types/notifications";
import { PlaybookResourceSelector } from "@flanksource-ui/api/types/playbooks";
import YAML from "yaml";
import FormikDurationPicker from "@flanksource-ui/components/Forms/Formik/FormikDurationPicker";
import FormikTextInput from "@flanksource-ui/components/Forms/Formik/FormikTextInput";
import FormikTextArea from "@flanksource-ui/components/Forms/Formik/FormikTextArea";
import { toastError } from "@flanksource-ui/components/Toast/toast";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import DeleteButton from "@flanksource-ui/ui/Buttons/DeleteButton";
import { parseDateMath } from "@flanksource-ui/ui/Dates/TimeRangePicker/parseDateMath";
import ErrorMessage from "@flanksource-ui/ui/FormControls/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Formik, Form, FormikBag } from "formik";
import { omit } from "lodash";
import { FaCircleNotch } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import FormikNotificationDirectResourceField from "./FormikNotificationDirectResourceField";
import { FormikCodeEditor } from "@flanksource-ui/components/Forms/Formik/FormikCodeEditor";

type NotificationSilenceFormProps = {
  data?: SilenceSaveFormValues;
  footerClassName?: string;
  onSuccess?: (data: SilenceSaveFormValues) => void;
  onCancel?: () => void;
};

export default function NotificationSilenceDirectForm({
  data,
  footerClassName = "flex flex-row justify-end px-4",
  onSuccess = () => {},
  onCancel = () => {}
}: NotificationSilenceFormProps) {
  const [searchParam] = useSearchParams();

  const component_id = searchParam.get("component_id") ?? undefined;
  const config_id = searchParam.get("config_id") ?? undefined;
  const check_id = searchParam.get("check_id") ?? undefined;
  const canary_id = searchParam.get("canary_id") ?? undefined;

  // Convert selectors from JSON (from DB) to YAML for display in editor
  const getSelectorsAsYaml = (selectors?: string): string | undefined => {
    if (!selectors) return undefined;
    try {
      // Try parsing as JSON first (data from DB is JSON)
      const parsed = JSON.parse(selectors);
      return YAML.stringify(parsed);
    } catch {
      // Already YAML or invalid, return as-is
      return selectors;
    }
  };

  const initialValues: Partial<SilenceSaveFormValues> = {
    ...data,
    name: data?.name,
    component_id: data?.component_id ?? component_id,
    config_id: data?.config_id ?? config_id,
    check_id: data?.check_id ?? check_id,
    canary_id: data?.canary_id ?? canary_id,
    selectors: getSelectorsAsYaml(data?.selectors)
  };

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: SilenceSaveRequest) => {
      if (data.id) {
        return updateNotificationSilence({
          id: data.id,
          name: data.name,
          filter: data.filter,
          updated_at: "now()",
          source: data.source,
          canary_id: data.canary_id,
          check_id: data.check_id,
          component_id: data.component_id,
          config_id: data.config_id,
          from: data.from!,
          until: data.until ?? null,
          description: data.description,
          recursive: data.recursive,
          namespace: data.namespace ?? ""
        });
      }
      return silenceNotification(data);
    },
    onSuccess
  });

  const { mutate: deleteSilence } = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteNotificationSilence(id);
      return res.data;
    },
    onSuccess,
    onError: (error: AxiosError) => {
      // do something
      console.error(error);
      toastError(error.message);
    }
  });

  const validate = (v: Partial<SilenceSaveFormValues>) => {
    const errors: { [key: string]: string } = {};
    if (!v.name) {
      errors.name = "Must specify a unique name";
    }
    if (
      v.canary_id == null &&
      v.check_id == null &&
      v.component_id == null &&
      v.config_id == null &&
      v.filter == null &&
      v.selectors == null
    ) {
      errors.form =
        "You must specify at least one of the following: a resource, a filter, or selectors";
    }
    return errors;
  };

  const submit = (
    v: Partial<SilenceSaveFormValues>,
    // @ts-ignore
    formik: FormikBag
  ) => {
    // Before submitting, we need to parse the date math expressions, if
    // any are present in the from and until fields.
    let { from, until, config_id } = v;
    if (until === "indefinitely") {
      until = null;
    }

    if (config_id === "all") {
      config_id = undefined;
    }

    if (!config_id && v.selectors?.length === 0) {
      formik.setErrors({
        form: "When all resources are selected, an attribute is needed",
        attributes: "required"
      });
      return;
    }

    const fromTime = from?.includes("now") ? parseDateMath(from, false) : from;

    const untilTime = until?.includes("now")
      ? parseDateMath(until, false)
      : until;

    v = omit(v, "error");

    // Convert selectors from YAML string to array if present
    let selectors: PlaybookResourceSelector[] | undefined = undefined;
    if (v.selectors && typeof v.selectors === "string" && v.selectors.trim()) {
      try {
        selectors = YAML.parse(v.selectors);
      } catch (e) {
        formik.setErrors({
          form: "Invalid YAML format in selectors field"
        });
        return;
      }
    }

    return mutate(
      {
        ...v,
        from: fromTime,
        until: untilTime,
        config_id: config_id,
        selectors
      } as SilenceSaveRequest,
      {
        onError(error) {
          // @ts-ignore
          formik.setErrors({ form: error });
        }
      }
    );
  };

  return (
    // @ts-ignore
    <div className="flex flex-1 flex-col gap-2 overflow-auto">
      <Formik<Partial<SilenceSaveFormValues>>
        initialValues={initialValues}
        validateOnChange={false}
        validateOnBlur={true}
        validate={validate}
        onSubmit={submit}
      >
        {({ errors }) => {
          return (
            <Form className="flex flex-1 flex-col gap-2 overflow-y-auto">
              <div
                className={`flex flex-col gap-2 overflow-y-auto p-4 ${data?.id ? "flex-1" : ""}`}
              >
                <FormikTextInput required name="name" label="Name" />

                <FormikNotificationDirectResourceField
                  prepopulatedConfigID={config_id}
                />

                <FormikDurationPicker
                  required
                  hint="Duration for which the silence will apply for, after which notifications will begin firing again"
                  fieldNames={{
                    from: "from",
                    to: "until"
                  }}
                  label="Duration"
                />

                <FormikTextArea
                  name="filter"
                  label="Filter"
                  hint="Notifications for resources matching this CEL expression will be silenced"
                />

                <FormikCodeEditor
                  fieldName="selectors"
                  format={"yaml"}
                  label="Selectors"
                  lines={10}
                  className="flex h-auto flex-col" // Override height
                  hint="List of resource selectors. Notifications for resources matching these selectors will be silenced"
                />

                <ErrorMessage
                  message={data?.error}
                  className="h-full pl-2 align-top"
                />

                <FormikTextArea name="description" label="Reason" />
                <ErrorMessage
                  message={
                    // @ts-ignore
                    errors.form
                  }
                />
              </div>
              <div className={`${footerClassName}`}>
                {data?.id && (
                  <>
                    <DeleteButton
                      title="Delete Silence"
                      description="Are you sure you want to delete this silence?"
                      yesLabel="Delete"
                      onConfirm={() => deleteSilence(data.id!)}
                    />

                    <div className="flex-1" />

                    <Button
                      onClick={() => {
                        onCancel();
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </Button>
                  </>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading && <FaCircleNotch className="mr-2 animate-spin" />}
                  {data?.id ? "Update" : "Submit"}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
