import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import {
  useSettingsCreateResource,
  useSettingsUpdateResource
} from "../../api/query-hooks/mutations/useSettingsResourcesMutations";
import { Button } from "../../ui/Button";
import { FormikCodeEditor } from "../Forms/Formik/FormikCodeEditor";
import FormikTextInput from "../Forms/Formik/FormikTextInput";
import DeleteResource from "../SchemaResourcePage/Delete/DeleteResource";
import { SchemaResourceType } from "../SchemaResourcePage/resourceTypes";
import { LogBackends } from "./LogBackends";

type ResourceFormProps = {
  values?: LogBackends;
  onUpdated?: () => void;
};

const logsBackendSchemaAPI: Pick<SchemaResourceType, "api" | "table" | "name"> =
  {
    api: "canary-checker",
    name: "Log Backends",
    table: "logging_backends"
  };
export default function LogBackendsForm({
  values,
  onUpdated = () => {}
}: ResourceFormProps) {
  const { mutate: updateLoggingBackend } = useSettingsUpdateResource(
    logsBackendSchemaAPI,
    undefined,
    true
  );

  const queryClient = useQueryClient();

  const { mutate: createLoggingBackend } =
    useSettingsCreateResource(logsBackendSchemaAPI);

  const initialValues: Partial<Omit<LogBackends, "created_by">> = {
    ...(values ? values : {})
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(formValues) => {
        if (values?.id) {
          updateLoggingBackend({
            id: values.id,
            ...formValues,
            // unset created_by
            created_by: undefined,
            created_at: undefined,
            updated_at: undefined
          });
        } else {
          createLoggingBackend({
            ...formValues
          });
        }
        queryClient.refetchQueries(["settings", "logging_backends", "all"]);
        onUpdated();
      }}
      validateOnBlur
      validateOnChange
      validateOnMount
    >
      {({ handleSubmit, handleReset, values, isValid }) => (
        <Form
          onSubmit={handleSubmit}
          onReset={handleReset}
          className="flex flex-col flex-1 overflow-y-auto gap-4"
        >
          <div className="flex flex-col flex-1 overflow-y-auto gap-4 p-4">
            <FormikTextInput name="name" label="Name" required />
            <div className="flex flex-col h-auto space-y-2">
              <FormikCodeEditor
                fieldName="labels"
                label="Labels"
                format="json"
                className="flex flex-col h-[100px]"
              />
            </div>

            <FormikCodeEditor
              label="Spec"
              fieldName="spec"
              format="yaml"
              className="flex flex-col h-[min(850px,calc(100vh-500px))]"
            />
          </div>

          {!values?.source && (
            <div className="flex flex-row gap-4 justify-end bg-gray-200 p-4">
              {!!initialValues.id && (
                <DeleteResource
                  resourceId={initialValues.id}
                  resourceInfo={logsBackendSchemaAPI}
                  isModal
                  onDeleted={onUpdated}
                />
              )}
              <Button
                disabled={!isValid}
                type="submit"
                text={!!initialValues.id ? "Update" : "Add"}
                className="btn-primary"
              />
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
}
