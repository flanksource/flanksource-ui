import {
  deleteNotificationSilence,
  silenceNotification,
  updateNotificationSilence,
  getNotificationSilencePreview
} from "@flanksource-ui/api/services/notifications";
import {
  SilenceNotificationResponse as SilenceNotificationRequest,
  SilenceNotificationResponse
} from "@flanksource-ui/api/types/notifications";
import FormikCheckbox from "@flanksource-ui/components/Forms/Formik/FormikCheckbox";
import FormikDurationPicker from "@flanksource-ui/components/Forms/Formik/FormikDurationPicker";
import FormikTextInput from "@flanksource-ui/components/Forms/Formik/FormikTextInput";
import FormikTextArea from "@flanksource-ui/components/Forms/Formik/FormikTextArea";
import FormikNotificationResourceField from "@flanksource-ui/components/Notifications/SilenceNotificationForm/FormikNotificationResourceField";
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
import { FormikCodeEditor } from "@flanksource-ui/components/Forms/Formik/FormikCodeEditor";
import { useState, useEffect } from "react";
import {
  ChevronRightIcon,
  InformationCircleIcon
} from "@heroicons/react/outline";

// Helper component to sync Formik values with parent state
function FormikValuesSyncer({
  values,
  setFormValues
}: {
  values: any;
  setFormValues: (values: any) => void;
}) {
  useEffect(() => {
    setFormValues(values);
  }, [values, setFormValues]);

  return null;
}

type NotificationSilenceFormProps = {
  data?: SilenceNotificationRequest;
  footerClassName?: string;
  onSuccess?: (data: SilenceNotificationResponse) => void;
  onCancel?: () => void;
};

export default function NotificationSilenceForm({
  data,
  footerClassName = "flex flex-row justify-end px-4",
  onSuccess = () => {},
  onCancel = () => {}
}: NotificationSilenceFormProps) {
  const [showFilterExamples, setShowFilterExamples] = useState(false);
  const [showSelectorsExamples, setShowSelectorsExamples] = useState(false);
  const [activeField, setActiveField] = useState<
    "resource" | "filter" | "selector" | null
  >(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const filterExamples = [
    {
      code: `config.type == "AWS::RDS::DBInstance" && jsonpath("$['account-name']", tags) == "flanksource" && config.config.Engine == "postgres"`,
      description:
        "Silence planned maintenance and brief healthy/unhealthy flaps for RDS Postgres instances in flanksource account"
    },
    {
      code: 'name == "postgresql" && config.type == "Kubernetes::StatefulSet"',
      description: "Silence notification from all postgresql statefulsets"
    },
    {
      code: 'name.startsWith("my-app-")',
      description: "Silence notifications from pods starting with 'my-app-'"
    },
    {
      code: `matchQuery(.config, "type=Kubernetes::Pod,Kubernetes::Deployment")`,
      description: "Silence notifications from all pods and deployments"
    },
    {
      code: `jsonpath("$['Expected-Fail']", labels) == "true"`,
      description:
        "Silence notifications from health checks that are expected to fail"
    },
    {
      code: '"helm.sh/chart" in labels',
      description: "Silence notifications from resources of Helm chart"
    }
  ];

  const selectorsExamples = [
    {
      title: "Silence notifications from all jobs with low severity",
      code: `selectors:
  - types:
      - Kubernetes::Job
    tagSelector: severity=low
`
    },
    {
      title:
        "Silence notifications from ap-south-1 region for the test account",
      code: `selectors:
  - tagSelector: region=ap-south-1,account=830064254263
`
    },
    {
      title: "Silence health checks expected to fail",
      code: `selectors:
  - labelSelector: Expected-Fail=true
`
    },
    {
      title:
        "Silence notifications from pods starting with specific name pattern",
      code: `selectors:
  - types:
      - Kubernetes::Pod
    nameSelector: my-app-*
`
    },
    {
      title: "Silence notifications from resources of a specific Helm chart",
      code: `selectors:
  - tagSelector: helm.sh/chart=my-app-1.0.0
`
    }
  ];

  const initialValues: Partial<SilenceNotificationRequest> = {
    ...data,
    name: data?.name,
    component_id: data?.component_id,
    config_id: data?.config_id,
    check_id: data?.check_id,
    canary_id: data?.canary_id
  };

  // Create a dynamic query key based on active field and current form values
  const [formValues, setFormValues] = useState(initialValues);

  // Determine which field should be active based on existing data
  useEffect(() => {
    if (
      data?.component_id ||
      data?.config_id ||
      data?.check_id ||
      data?.canary_id
    ) {
      setActiveField("resource");
    } else if (data?.filter) {
      setActiveField("filter");
    } else if (data?.selectors) {
      setActiveField("selector");
    }
  }, [data]);

  // Monitor all form fields to determine which is active
  useEffect(() => {
    const hasResource = !!(
      formValues.component_id ||
      formValues.config_id ||
      formValues.check_id ||
      formValues.canary_id
    );
    const hasFilter = !!(
      formValues.filter &&
      typeof formValues.filter === "string" &&
      formValues.filter.trim()
    );
    const hasSelectors = !!(
      formValues.selectors &&
      typeof formValues.selectors === "string" &&
      formValues.selectors.trim()
    );

    if (hasResource && activeField !== "resource") {
      setActiveField("resource");
    } else if (hasFilter && activeField !== "filter") {
      setActiveField("filter");
    } else if (hasSelectors && activeField !== "selector") {
      setActiveField("selector");
    } else if (
      !hasResource &&
      !hasFilter &&
      !hasSelectors &&
      activeField !== null
    ) {
      setActiveField(null);
    }
  }, [
    formValues.component_id,
    formValues.config_id,
    formValues.check_id,
    formValues.canary_id,
    formValues.filter,
    formValues.selectors,
    activeField
  ]);

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: SilenceNotificationRequest) => {
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
          from: data.from,
          until: data.until,
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

  const validate = (v: Partial<SilenceNotificationRequest>) => {
    const errors: { [key: string]: string } = {};
    if (!v.name) {
      errors.name = "Must specify a unique name";
    }

    // Remove the mutual exclusion validation from here
    // It will be checked in the submit function

    return errors;
  };

  const submit = (
    v: Partial<SilenceNotificationRequest>,
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

    return mutate(
      {
        ...v,
        from: fromTime,
        until: untilTime
      } as SilenceNotificationRequest,
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
    <div className="flex flex-col gap-2 overflow-auto">
      <Formik<Partial<SilenceNotificationRequest>>
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
              <FormikValuesSyncer
                values={values}
                setFormValues={setFormValues}
              />
              <div
                className={`flex flex-col gap-2 overflow-y-auto p-4 ${data?.id ? "flex-1" : ""}`}
              >
                <FormikTextInput required name="name" label="Name" />

                {/* Mutual Exclusion Info */}
                <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
                  <div className="flex items-start gap-2">
                    <InformationCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                    <div className="text-sm text-blue-800">
                      <span className="font-medium">Silence Criteria:</span> You
                      can specify exactly one of the following criteria types:
                      <strong> Resource</strong>, <strong>Filter</strong>, or{" "}
                      <strong>Selectors</strong>. When you start filling one,
                      the others will be disabled.
                    </div>
                  </div>
                </div>

                {/* Resource Block */}
                <div
                  className={`rounded-lg border p-4 transition-all duration-200 ${
                    activeField !== null && activeField !== "resource"
                      ? "cursor-not-allowed border-gray-300 bg-gray-100 opacity-60"
                      : "cursor-default border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-gray-700">
                        Resource
                      </h3>
                      {activeField !== null && activeField !== "resource" && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <InformationCircleIcon className="h-4 w-4" />
                          <span>Only one criteria can be selected</span>
                        </div>
                      )}
                    </div>
                    {activeField === "resource" && (
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue("component_id", undefined);
                          setFieldValue("config_id", undefined);
                          setFieldValue("check_id", undefined);
                          setFieldValue("canary_id", undefined);
                          setFieldValue("recursive", false);
                          setActiveField(null);
                          setFormValues({
                            ...values,
                            component_id: undefined,
                            config_id: undefined,
                            check_id: undefined,
                            canary_id: undefined,
                            recursive: false
                          });
                        }}
                        className="text-xs font-medium text-red-600 hover:text-red-700"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div
                    className={`relative ${
                      activeField !== null && activeField !== "resource"
                        ? "pointer-events-none"
                        : ""
                    }`}
                  >
                    <FormikNotificationResourceField
                      disabled={
                        activeField !== null && activeField !== "resource"
                      }
                      onFieldChange={(_hasValue) => {
                        // Update formValues to trigger the useEffect
                        setFormValues(values);
                      }}
                    />
                    {activeField !== null && activeField !== "resource" && (
                      <div className="absolute inset-0 cursor-not-allowed rounded-md bg-gray-100 bg-opacity-50" />
                    )}
                  </div>
                  <div className="mt-3">
                    <div
                      className={`relative ${
                        activeField !== "resource"
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                    >
                      <FormikCheckbox
                        checkboxStyle="toggle"
                        name="recursive"
                        label="Recursive"
                        hint="When selected, the silence will apply to all children of the item"
                        disabled={activeField !== "resource"}
                      />
                    </div>
                  </div>
                </div>

                <FormikDurationPicker
                  required
                  hint="Duration for which the silence will apply for, after which notifications will begin firing again"
                  fieldNames={{
                    from: "from",
                    to: "until"
                  }}
                  label="Duration"
                />

                {/* Filter Block */}
                <div
                  className={`rounded-lg border p-4 transition-all duration-200 ${
                    activeField !== null && activeField !== "filter"
                      ? "cursor-not-allowed border-gray-300 bg-gray-100 opacity-60"
                      : "cursor-default border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-gray-700">
                        Filter
                      </h3>
                      {activeField !== null && activeField !== "filter" && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <InformationCircleIcon className="h-4 w-4" />
                          <span>Only one criteria can be selected</span>
                        </div>
                      )}
                    </div>
                    {activeField === "filter" && (
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue("filter", "");
                          setActiveField(null);
                          setFormValues({ ...values, filter: "" });
                        }}
                        className="text-xs font-medium text-red-600 hover:text-red-700"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div
                    className={`relative ${
                      activeField !== null && activeField !== "filter"
                        ? "pointer-events-none"
                        : ""
                    }`}
                  >
                    <FormikTextArea
                      name="filter"
                      label="Filter"
                      hint="Notifications for resources matching this CEL expression will be silenced"
                      disabled={
                        activeField !== null && activeField !== "filter"
                      }
                      readOnly={
                        activeField !== null && activeField !== "filter"
                      }
                      className={`flex flex-col ${activeField !== null && activeField !== "filter" ? "opacity-50" : ""}`}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        const hasValue = e.target.value.trim() !== "";
                        if (hasValue) {
                          setActiveField("filter");
                          // Clear other fields
                          setFieldValue("component_id", undefined);
                          setFieldValue("config_id", undefined);
                          setFieldValue("check_id", undefined);
                          setFieldValue("canary_id", undefined);
                          setFieldValue("recursive", false);
                          setFieldValue("selectors", "");
                        } else if (activeField === "filter") {
                          setActiveField(null);
                        }
                        setFormValues({ ...values, filter: e.target.value });
                      }}
                    />
                    {activeField !== null && activeField !== "filter" && (
                      <div className="absolute inset-0 cursor-not-allowed rounded-md bg-gray-100 bg-opacity-50" />
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowFilterExamples(!showFilterExamples)}
                  className="mb-2 flex items-center gap-1 rounded bg-blue-50/50 px-2 py-1 text-left text-sm font-medium text-blue-600 hover:bg-blue-100/50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                  <ChevronRightIcon
                    className={`h-4 w-4 transition-transform ${showFilterExamples ? "rotate-90" : ""}`}
                  />
                  Filter Examples
                </button>

                {showFilterExamples && (
                  <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50/50 shadow-sm">
                    <div className="space-y-4 p-4">
                      {filterExamples.map((example, index) => (
                        <div
                          key={index}
                          className="overflow-hidden rounded-md border border-gray-200 bg-white"
                        >
                          <div className="border-b border-gray-200 bg-gray-50 px-3 py-2">
                            <p className="text-sm font-medium text-gray-700">
                              {example.description}
                            </p>
                          </div>
                          <div className="p-3">
                            <code className="block overflow-x-auto rounded border bg-gray-50 p-2 font-mono text-xs text-gray-800">
                              {example.code}
                            </code>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selectors Block */}
                <div
                  className={`rounded-lg border p-4 transition-all duration-200 ${
                    activeField !== null && activeField !== "selector"
                      ? "cursor-not-allowed border-gray-300 bg-gray-100 opacity-60"
                      : "cursor-default border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-gray-700">
                        Selectors
                      </h3>
                      {activeField !== null && activeField !== "selector" && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <InformationCircleIcon className="h-4 w-4" />
                          <span>Only one criteria can be selected</span>
                        </div>
                      )}
                    </div>
                    {activeField === "selector" && (
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue("selectors", "");
                          setActiveField(null);
                          setFormValues({ ...values, selectors: "" });
                        }}
                        className="text-xs font-medium text-red-600 hover:text-red-700"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div
                    className={`relative ${
                      activeField !== null && activeField !== "selector"
                        ? "pointer-events-none"
                        : ""
                    }`}
                  >
                    <FormikCodeEditor
                      fieldName="selectors"
                      format={"yaml"}
                      label="Selectors"
                      hint="List of resource selectors. Notifications for resources matching these selectors will be silenced"
                      lines={12}
                      disabled={
                        activeField !== null && activeField !== "selector"
                      }
                      className={`${activeField !== null && activeField !== "selector" ? "opacity-50" : ""}`}
                    />
                    {activeField !== null && activeField !== "selector" && (
                      <div className="absolute inset-0 cursor-not-allowed rounded-md bg-gray-100 bg-opacity-50" />
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowSelectorsExamples(!showSelectorsExamples)
                  }
                  className="mb-2 mt-2 flex items-center gap-1 rounded bg-blue-50/50 px-2 py-1 text-left text-sm font-medium text-blue-600 hover:bg-blue-100/50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                  <ChevronRightIcon
                    className={`h-4 w-4 transition-transform ${showSelectorsExamples ? "rotate-90" : ""}`}
                  />
                  Selector Examples
                </button>

                {showSelectorsExamples && (
                  <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50/50 shadow-sm">
                    <div className="space-y-4 p-4">
                      {selectorsExamples.map((example, index) => (
                        <div
                          key={index}
                          className="overflow-hidden rounded-md border border-gray-200 bg-white"
                        >
                          <div className="border-b border-gray-200 bg-gray-50 px-3 py-2">
                            <p className="text-sm font-medium text-gray-700">
                              {example.title}
                            </p>
                          </div>
                          <div className="p-3">
                            <pre className="overflow-x-auto whitespace-pre-wrap rounded border bg-gray-50 p-2 font-mono text-xs text-gray-800">
                              {example.code}
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <ErrorMessage
                  message={data?.error}
                  className="pl-2 align-top"
                />

                <FormikTextArea name="description" label="Reason" />

                {/* Notification Preview Section */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700">
                      Preview Notifications to be Silenced
                    </h3>
                    <button
                      type="button"
                      disabled={!activeField}
                      onClick={async () => {
                        setIsPreviewLoading(true);
                        try {
                          const params: {
                            resource_id?: string;
                            filter?: string;
                            selector?: string;
                          } = {};

                          if (activeField === "resource") {
                            const resourceId =
                              values.component_id ||
                              values.config_id ||
                              values.check_id ||
                              values.canary_id;
                            if (resourceId) params.resource_id = resourceId;
                          } else if (
                            activeField === "filter" &&
                            values.filter
                          ) {
                            params.filter = values.filter;
                          } else if (
                            activeField === "selector" &&
                            values.selectors
                          ) {
                            params.selector = values.selectors;
                          }

                          const data =
                            await getNotificationSilencePreview(params);
                          setPreviewData(data);
                        } catch (error) {
                          console.error("Error fetching preview:", error);
                          setPreviewData({ error: "Failed to fetch preview" });
                        } finally {
                          setIsPreviewLoading(false);
                        }
                      }}
                      className={`rounded px-3 py-1 text-xs font-medium ${
                        activeField
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "cursor-not-allowed bg-gray-300 text-gray-500"
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                  {activeField ? (
                    <div className="space-y-2">
                      {isPreviewLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <FaCircleNotch className="animate-spin" />
                          <span className="ml-2 text-sm text-gray-500">
                            Loading preview...
                          </span>
                        </div>
                      ) : previewData ? (
                        <div className="space-y-2">
                          {previewData.error ? (
                            <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                              {previewData.error}
                            </div>
                          ) : Array.isArray(previewData) &&
                            previewData.length > 0 ? (
                            <>
                              <div className="text-sm text-gray-600">
                                {previewData.length} notification(s) will be
                                silenced:
                              </div>
                              {previewData
                                .slice(0, 5)
                                .map((notification: any, index: number) => (
                                  <div
                                    key={index}
                                    className="rounded border bg-white p-2 text-sm"
                                  >
                                    <div className="font-medium">
                                      {notification.title ||
                                        notification.name ||
                                        "Notification"}
                                    </div>
                                    <div className="text-gray-500">
                                      {notification.message ||
                                        notification.description ||
                                        "No description"}
                                    </div>
                                  </div>
                                ))}
                              {previewData.length > 5 && (
                                <div className="text-sm text-gray-500">
                                  +{previewData.length - 5} more...
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-sm text-gray-500">
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
                      Select a resource, filter, or selector to preview
                      notifications.
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
              <div className={`${footerClassName}`}>
                {data?.id && (
                  <>
                    <DeleteButton
                      title="Delete Silence"
                      description="Are you sure you want to delete this silence?"
                      yesLabel="Delete"
                      onConfirm={() => deleteSilence(data.id)}
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
