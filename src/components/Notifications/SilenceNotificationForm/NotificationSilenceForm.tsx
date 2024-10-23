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
import FormikTextArea from "@flanksource-ui/components/Forms/Formik/FormikTextArea";
import FormikNotificationResourceField from "@flanksource-ui/components/Notifications/SilenceNotificationForm/FormikNotificationField";
import { toastError } from "@flanksource-ui/components/Toast/toast";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { parseDateMath } from "@flanksource-ui/ui/Dates/TimeRangePicker/parseDateMath";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Form, Formik } from "formik";
import { FaCircleNotch } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

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
  const [searchParam] = useSearchParams();

  const component_id = searchParam.get("component_id") ?? undefined;
  const config_id = searchParam.get("config_id") ?? undefined;
  const check_id = searchParam.get("check_id") ?? undefined;
  const canary_id = searchParam.get("canary_id") ?? undefined;

  const initialValues: Partial<SilenceNotificationRequest> = {
    ...data,
    component_id: data?.component_id ?? component_id,
    config_id: data?.config_id ?? config_id,
    check_id: data?.check_id ?? check_id,
    canary_id: data?.canary_id ?? canary_id
  };

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: SilenceNotificationRequest) => {
      if (data.id) {
        return updateNotificationSilence({
          id: data.id,
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
    onSuccess,
    onError: (error: AxiosError) => {
      // do something
      console.error(error);
      toastError(error.message);
    }
  });

  const { mutate: deleteSilence, isLoading: isDeleting } = useMutation({
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

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-auto">
      <Formik<Partial<SilenceNotificationRequest>>
        initialValues={initialValues}
        onSubmit={(v) => {
          // Before submitting, we need to parse the date math expressions, if
          // any are present in the from and until fields.
          const { from, until } = v;
          const fromTime = from?.includes("now")
            ? parseDateMath(from, false)
            : from;

          const untilTime = until?.includes("now")
            ? parseDateMath(until, false)
            : until;

          return mutate({
            ...v,
            from: fromTime,
            until: untilTime
          } as SilenceNotificationRequest);
        }}
      >
        <Form className="flex flex-1 flex-col gap-2 overflow-y-auto">
          <div
            className={`flex flex-col gap-2 overflow-y-auto p-4 ${data?.id ? "flex-1" : ""}`}
          >
            <FormikNotificationResourceField />
            <FormikCheckbox name="recursive" label="Recursive" />
            <FormikDurationPicker
              fieldNames={{
                from: "from",
                to: "until"
              }}
              label="Silence Duration"
            />
            <FormikTextArea name="description" label="Reason" />
          </div>
          <div className={`${footerClassName}`}>
            {data?.id && (
              <>
                <Button
                  onClick={() => {
                    onCancel();
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </Button>
                <div className="flex-1" />
                <Button
                  onClick={() => deleteSilence(data.id)}
                  className="btn-danger"
                >
                  {isDeleting && (
                    <FaCircleNotch className="mr-2 animate-spin" />
                  )}
                  {isDeleting ? "Deleting" : "Delete"}
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
      </Formik>
    </div>
  );
}
