import { silenceNotification } from "@flanksource-ui/api/services/notifications";
import { SilenceNotificationResponse as SilenceNotificationRequest } from "@flanksource-ui/api/types/notifications";
import FormikCheckbox from "@flanksource-ui/components/Forms/Formik/FormikCheckbox";
import FormikDurationPicker from "@flanksource-ui/components/Forms/Formik/FormikDurationPicker";
import FormikTextArea from "@flanksource-ui/components/Forms/Formik/FormikTextArea";
import FormikNotificationResourceField from "@flanksource-ui/components/Notifications/SilenceNotificationForm/FormikNotificationField";
import { toastError } from "@flanksource-ui/components/Toast/toast";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { FaCircleNotch } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function NotificationSilenceForm() {
  const [searchParam] = useSearchParams();
  const navigate = useNavigate();

  const component_id = searchParam.get("component_id") ?? undefined;
  const config_id = searchParam.get("config_id") ?? undefined;
  const check_id = searchParam.get("check_id") ?? undefined;
  const canary_id = searchParam.get("canary_id") ?? undefined;

  const initialValues: Partial<SilenceNotificationRequest> = {
    component_id,
    config_id,
    check_id,
    canary_id
  };

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: SilenceNotificationRequest) => silenceNotification(data),
    onSuccess: () => {
      navigate("/notifications/silenced");
    },
    onError: (error) => {
      // do something
      console.error(error);
      toastError("Failed to silence notification");
    }
  });

  return (
    <div className="flex flex-1 flex-col gap-2">
      <Formik<Partial<SilenceNotificationRequest>>
        initialValues={initialValues}
        onSubmit={(v) => {
          return mutate({
            ...v
          } as SilenceNotificationRequest);
        }}
      >
        <Form className="flex flex-1 flex-col gap-2 overflow-y-auto py-4">
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
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading && <FaCircleNotch className="mr-2 animate-spin" />}
              Submit
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
