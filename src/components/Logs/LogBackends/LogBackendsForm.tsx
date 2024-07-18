import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";

import {
  useSettingsCreateResource,
  useSettingsUpdateResource
} from "@flanksource-ui/api/query-hooks/mutations/useSettingsResourcesMutations";
import { FormikCodeEditor } from "@flanksource-ui/components/Forms/Formik/FormikCodeEditor";
import FormikKeyValueMapField from "@flanksource-ui/components/Forms/Formik/FormikKeyValueMapField";
import FormikTextInput from "@flanksource-ui/components/Forms/Formik/FormikTextInput";
import DeleteResource from "@flanksource-ui/components/SchemaResourcePage/Delete/DeleteResource";
import { SchemaResourceType } from "@flanksource-ui/components/SchemaResourcePage/resourceTypes";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
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
    {
      onSuccess: () => {
        onUpdated();
      }
    }
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
          className="flex flex-1 flex-col gap-4 overflow-y-auto"
        >
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            <FormikTextInput name="name" label="Name" required />
            <FormikKeyValueMapField label="Labels" name="labels" outputJson />
            <FormikCodeEditor
              label="Spec"
              fieldName="spec"
              format="yaml"
              className="flex h-[min(850px,calc(100vh-500px))] flex-col"
            />
          </div>

          {!values?.source && (
            <div className="flex flex-row justify-end gap-4 bg-gray-200 p-4">
              {!!initialValues.id && (
                <DeleteResource
                  resourceId={initialValues.id}
                  resourceInfo={logsBackendSchemaAPI}
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
