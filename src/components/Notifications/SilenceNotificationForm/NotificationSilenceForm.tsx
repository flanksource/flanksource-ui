import {
  deleteNotificationSilence,
  silenceNotification,
  updateNotificationSilence,
  getNotificationSilencePreview
} from "@flanksource-ui/api/services/notifications";
import {
  SilenceSaveRequest,
  SilenceSaveFormValues,
  NotificationSendHistorySummary
} from "@flanksource-ui/api/types/notifications";
import { PlaybookResourceSelector } from "@flanksource-ui/api/types/playbooks";
import FormikCheckbox from "@flanksource-ui/components/Forms/Formik/FormikCheckbox";
import FormikDurationPicker from "@flanksource-ui/components/Forms/Formik/FormikDurationPicker";
import FormikTextInput from "@flanksource-ui/components/Forms/Formik/FormikTextInput";
import FormikTextArea from "@flanksource-ui/components/Forms/Formik/FormikTextArea";
import FormikNotificationResourceField from "@flanksource-ui/components/Notifications/SilenceNotificationForm/FormikNotificationResourceField";
import { toastError } from "@flanksource-ui/components/Toast/toast";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { Tag } from "@flanksource-ui/ui/Tags/Tag";
import DeleteButton from "@flanksource-ui/ui/Buttons/DeleteButton";
import { parseDateMath } from "@flanksource-ui/ui/Dates/TimeRangePicker/parseDateMath";
import ErrorMessage from "@flanksource-ui/ui/FormControls/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Formik, Form, FormikBag } from "formik";
import { omit } from "lodash";
import { FaCircleNotch } from "react-icons/fa";
import { FormikCodeEditor } from "@flanksource-ui/components/Forms/Formik/FormikCodeEditor";
import { useState, useEffect } from "react";
import { Age } from "@flanksource-ui/ui/Age";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import YAML from "yaml";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";
import {
  FilterExamples,
  SelectorExamples
} from "./NotificationSilenceExamples";

type NotificationSilenceFormProps = {
  data?: SilenceSaveFormValues;
  footerClassName?: string;
  onSuccess?: (data: SilenceSaveFormValues) => void;
  onCancel?: () => void;
};

export default function NotificationSilenceForm({
  data,
  footerClassName = "flex flex-row justify-end px-4",
  onSuccess = () => {},
  onCancel = () => {}
}: NotificationSilenceFormProps) {
  const [selectedType, setSelectedType] = useState<
    "resource" | "filter" | "selector" | null
  >(null);
  const [previewData, setPreviewData] = useState<
    NotificationSendHistorySummary[] | null
  >(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<unknown | null>(null);

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
    component_id: data?.component_id,
    config_id: data?.config_id,
    check_id: data?.check_id,
    canary_id: data?.canary_id,
    selectors: getSelectorsAsYaml(data?.selectors)
  };

  // Determine selected type based on existing data when editing
  useEffect(() => {
    if (data) {
      if (
        data?.component_id ||
        data?.config_id ||
        data?.check_id ||
        data?.canary_id
      ) {
        setSelectedType("resource");
      } else if (data?.filter) {
        setSelectedType("filter");
      } else if (data?.selectors) {
        setSelectedType("selector");
      }
    }
  }, [data]);

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: SilenceSaveRequest) => {
      if (data.id) {
        return updateNotificationSilence({
          id: data.id,
          name: data.name,
          filter: data.filter,
          selectors: data.selectors
            ? JSON.stringify(data.selectors)
            : undefined,
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

    // Remove the mutual exclusion validation from here
    // It will be checked in the submit function

    return errors;
  };

  const submit = (
    v: Partial<SilenceSaveFormValues>,
    // @ts-ignore
    formik: FormikBag
  ) => {
    // Validate mutual exclusion on submit
    const hasResource = !!(
      v.canary_id ||
      v.check_id ||
      v.component_id ||
      v.config_id
    );
    const hasFilter = !!(v.filter && v.filter.trim());
    const hasSelectors = !!(v.selectors && v.selectors.trim());

    const fieldsSet = [hasResource, hasFilter, hasSelectors].filter(
      Boolean
    ).length;

    if (fieldsSet === 0) {
      formik.setErrors({
        form: "You must specify exactly one of the following: a resource, a filter, or selectors"
      });
      return;
    } else if (fieldsSet > 1) {
      formik.setErrors({
        form: "You can only specify one of the following: a resource, a filter, or selectors. Please clear the others."
      });
      return;
    }

    // Before submitting, we need to parse the date math expressions, if
    // any are present in the from and until fields.
    let { from, until } = v;
    if (until === "indefinitely") {
      until = null;
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

  const previewBtnOnClick = (values: Partial<SilenceSaveFormValues>) => {
    return async () => {
      setIsPreviewLoading(true);
      setPreviewError(null);

      try {
        const params: {
          resource_id?: string;
          filter?: string;
          selector?: string;
          recursive?: boolean;
        } = {};

        if (selectedType === "resource") {
          const resourceId =
            values.component_id ||
            values.config_id ||
            values.check_id ||
            values.canary_id;
          if (resourceId) params.resource_id = resourceId;
          if (values.recursive) params.recursive = values.recursive;
        } else if (selectedType === "filter" && values.filter) {
          params.filter = values.filter;
        } else if (selectedType === "selector" && values.selectors) {
          // values.selectors can be either a YAML string (from editor) or
          // an object (if data came from API as parsed JSONB)
          const result =
            typeof values.selectors === "string"
              ? YAML.parse(values.selectors)
              : values.selectors;
          params.selector = JSON.stringify(result);
        } else {
          throw new Error("unknown selector type");
        }

        const data = await getNotificationSilencePreview(params);
        setPreviewData(data || []);
        setPreviewError(null);
      } catch (error) {
        console.error("Error fetching preview:", error);
        setPreviewData(null);
        setPreviewError((error as AxiosError<any>)?.response?.data ?? error);
      } finally {
        setIsPreviewLoading(false);
      }
    };
  };

  return (
    // @ts-ignore
    <div className="flex flex-col gap-2 overflow-auto">
      <Formik<Partial<SilenceSaveFormValues>>
        initialValues={initialValues}
        validateOnChange={false}
        validateOnBlur={true}
        validate={validate}
        onSubmit={submit}
        enableReinitialize={true}
      >
        {({ errors, values, setFieldValue }) => {
          return (
            <Form className="flex flex-1 flex-col gap-2 overflow-y-auto">
              {!selectedType ? (
                // Selection boxes view
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h3 className="mb-2 text-lg font-medium">
                    Choose Silence Criteria
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <div
                      onClick={() => setSelectedType("resource")}
                      role="button"
                      className="flex h-32 w-48 cursor-pointer flex-col items-center justify-center space-y-2 rounded-md border border-gray-300 p-4 text-center hover:border-blue-200 hover:bg-gray-100"
                    >
                      <Icon name="config" className="h-8 w-8" />
                      <span className="font-medium">Resource</span>
                      <span className="text-xs text-gray-500">
                        Silence a specific resource
                      </span>
                    </div>
                    <div
                      onClick={() => setSelectedType("filter")}
                      role="button"
                      className="flex h-32 w-48 cursor-pointer flex-col items-center justify-center space-y-2 rounded-md border border-gray-300 p-4 text-center hover:border-blue-200 hover:bg-gray-100"
                    >
                      <Icon name="filter" className="h-8 w-8" />
                      <span className="font-medium">Filter</span>
                      <span className="text-xs text-gray-500">
                        Use CEL expression to match resources
                      </span>
                    </div>
                    <div
                      onClick={() => setSelectedType("selector")}
                      role="button"
                      className="flex h-32 w-48 cursor-pointer flex-col items-center justify-center space-y-2 rounded-md border border-gray-300 p-4 text-center hover:border-blue-200 hover:bg-gray-100"
                    >
                      <Icon name="search" className="h-8 w-8" />
                      <span className="font-medium">Selector</span>
                      <span className="text-xs text-gray-500">
                        Use selectors to match resources
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                // Form view
                <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
                  <FormikTextInput required name="name" label="Name" />

                  <FormikDurationPicker
                    required
                    hint="Duration for which the silence will apply for, after which notifications will begin firing again"
                    fieldNames={{
                      from: "from",
                      to: "until"
                    }}
                    label="Duration"
                  />

                  <FormikTextArea name="description" label="Reason" />

                  {/* Type-specific content */}
                  {selectedType === "resource" && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <FormikNotificationResourceField />
                      <div className="mt-3">
                        <FormikCheckbox
                          checkboxStyle="toggle"
                          name="recursive"
                          label="Recursive"
                          hint="When selected, the silence will apply to all children of the item"
                        />
                      </div>
                    </div>
                  )}

                  {selectedType === "filter" && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <FormikTextArea
                        name="filter"
                        label="Filter"
                        hint="Resources matching this CEL expression will have their notifications silenced"
                      />
                      <div className="mt-3">
                        <a
                          href="https://flanksource.com/docs/guide/notifications/concepts/silences#filters"
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Help: Filter reference
                        </a>
                      </div>
                      <FilterExamples />
                    </div>
                  )}

                  {selectedType === "selector" && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <FormikCodeEditor
                        fieldName="selectors"
                        format={"yaml"}
                        label="Selectors"
                        hint="Resources matching these selectors will have their notifications silenced"
                        lines={12}
                        saveAsString={true}
                      />
                      <div className="mt-3">
                        <a
                          href="https://flanksource.com/docs/reference/resource-selector"
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Help: Resource selectors reference
                        </a>
                      </div>
                      <SelectorExamples />
                    </div>
                  )}

                  {/* Notification Preview Section */}
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h3 className="mb-3 text-sm font-medium text-gray-700">
                      Preview Notifications to be Silenced
                    </h3>
                    {previewData || isPreviewLoading || previewError ? (
                      <div className="space-y-2">
                        {isPreviewLoading ? (
                          <div className="flex items-center justify-center py-4">
                            <FaCircleNotch className="animate-spin" />
                            <span className="ml-2 text-sm text-gray-500">
                              Loading preview...
                            </span>
                          </div>
                        ) : previewError ? (
                          <ErrorViewer error={previewError} />
                        ) : previewData ? (
                          <div className="space-y-2">
                            {Array.isArray(previewData) &&
                            previewData.length > 0 ? (
                              <>
                                <div className="mb-2 text-sm text-gray-600">
                                  {previewData.length} notification(s) will be
                                  silenced:
                                </div>
                                <div className="space-y-2">
                                  {previewData.map((notification, index) => (
                                    <div
                                      key={index}
                                      className="rounded border border-gray-200 bg-white p-3"
                                    >
                                      <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                          {/* Resource and Count */}
                                          <div className="text-sm text-gray-700">
                                            <div className="flex flex-wrap gap-1">
                                              <Icon
                                                name={
                                                  notification?.resource?.type
                                                }
                                              />
                                              <span className="mr-2">
                                                {" "}
                                                {notification.resource?.name}
                                              </span>
                                              <Tag title="tags">
                                                {notification.resource?.type
                                                  ?.split("::")
                                                  .at(-1)
                                                  ?.toLocaleLowerCase()}
                                              </Tag>

                                              {Object.entries(
                                                notification.resource?.tags ??
                                                  {}
                                              ).map(([key, val]) => (
                                                <Tag title={key} key={key}>
                                                  {val}
                                                </Tag>
                                              ))}

                                              <span className="mr-2">
                                                {" "}
                                                on{" "}
                                                <Age
                                                  from={notification.created_at}
                                                />{" "}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <div className="rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
                                No notifications match this criteria.
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            Click "Preview" to see which notifications will be
                            silenced.
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Click the "Preview" button below to see which
                        notifications will be silenced.
                      </div>
                    )}
                  </div>

                  <ErrorMessage
                    message={
                      // @ts-ignore
                      errors.form
                    }
                  />
                </div>
              )}

              {/* Footer */}
              <div className={`${footerClassName} mb-4 gap-2`}>
                {/* Left side - Back button */}
                {selectedType && !data?.id && (
                  <Button
                    type="button"
                    onClick={() => {
                      setSelectedType(null);
                      setPreviewData(null);
                      setPreviewError(null);
                    }}
                    className="btn-secondary"
                  >
                    Back
                  </Button>
                )}

                {/* Delete button for editing */}
                {data?.id && (
                  <DeleteButton
                    title="Delete Silence"
                    description="Are you sure you want to delete this silence?"
                    yesLabel="Delete"
                    onConfirm={() => deleteSilence(data.id!)}
                  />
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Right side - Preview, Cancel/Submit buttons */}
                {selectedType && (
                  <Button
                    type="button"
                    onClick={previewBtnOnClick(values)}
                    className="btn-secondary"
                    disabled={isPreviewLoading}
                  >
                    {isPreviewLoading && (
                      <FaCircleNotch className="mr-2 animate-spin" />
                    )}
                    Preview
                  </Button>
                )}

                {data?.id && (
                  <Button
                    onClick={() => {
                      onCancel();
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </Button>
                )}

                {selectedType && (
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <FaCircleNotch className="mr-2 animate-spin" />
                    )}
                    {data?.id ? "Update" : "Submit"}
                  </button>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
