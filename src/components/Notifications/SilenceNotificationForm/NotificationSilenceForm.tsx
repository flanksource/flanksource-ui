import {
  deleteNotificationSilence,
  silenceNotification,
  updateNotificationSilence
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
import { useState } from "react";

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

  const filterExamples = [
    {
      code: `config.type == "AWS::RDS::DBInstance" && tags["account-name"] == "flanksource" && config.config.Engine == "postgres"`,
      description:
        "Silence planned maintenance and brief healthy/unhealthy flaps for RDS Postgres instances in flanksource account"
    },
    {
      code: 'name == "postgresql" && config.type == "Kubernetes::StatefulSet"',
      description: "Silence notification from all postgresql sts"
    },
    {
      code: 'name.startsWith("my-app-")',
      description: "Silence notifications from pods starting with 'my-app-'"
    },
    {
      code: 'labels["Expected-Fail"] == "true"',
      description:
        "Silence notifications from health checks that are expected to fail"
    },
    {
      code: 'labels["helm.sh/chart"] != ""',
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
    if (
      v.canary_id == null &&
      v.check_id == null &&
      v.component_id == null &&
      v.config_id == null &&
      v.selectors == null &&
      v.filter == null
    ) {
      errors.form =
        "You must specify at least one of the following: a resource, a filter, or selectors";
    }
    return errors;
  };

  const submit = (
    v: Partial<SilenceNotificationRequest>,
    // @ts-ignore
    formik: FormikBag
  ) => {
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
      >
        {({ errors }) => {
          return (
            <Form className="flex flex-1 flex-col gap-2 overflow-y-auto">
              <div
                className={`flex flex-col gap-2 overflow-y-auto p-4 ${data?.id ? "flex-1" : ""}`}
              >
                <FormikTextInput required name="name" label="Name" />

                <FormikNotificationResourceField />

                <FormikCheckbox
                  checkboxStyle="toggle"
                  name="recursive"
                  label="Recursive"
                  hint="When selected, the silence will apply to all children of the item"
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
                <button
                  type="button"
                  onClick={() => setShowFilterExamples(!showFilterExamples)}
                  className="mb-2 flex items-center gap-1 rounded px-1 py-0.5 text-left text-sm font-medium text-gray-600 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                >
                  <svg
                    className={`h-4 w-4 transition-transform ${showFilterExamples ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  Show Filter Examples
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

                <div>
                  <FormikCodeEditor
                    fieldName="selectors"
                    format={"yaml"}
                    label="Selectors"
                    hint="List of resource selectors. Notifications for resources matching these selectors will be silenced"
                    lines={12}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowSelectorsExamples(!showSelectorsExamples)
                    }
                    className="mb-2 mt-2 flex items-center gap-1 rounded px-1 py-0.5 text-left text-sm font-medium text-gray-600 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                  >
                    <svg
                      className={`h-4 w-4 transition-transform ${showSelectorsExamples ? "rotate-90" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    Show Selectors Examples
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
                </div>

                <ErrorMessage
                  message={data?.error}
                  className="pl-2 align-top"
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
