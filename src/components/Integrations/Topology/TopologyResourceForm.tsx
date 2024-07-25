import {
  useSettingsCreateResource,
  useSettingsUpdateResource
} from "@flanksource-ui/api/query-hooks/mutations/useSettingsResourcesMutations";
import { SchemaResourceI } from "@flanksource-ui/api/schemaResources";
import { FormikCodeEditor } from "@flanksource-ui/components/Forms/Formik/FormikCodeEditor";
import FormikKeyValueMapField from "@flanksource-ui/components/Forms/Formik/FormikKeyValueMapField";
import FormikTextInput from "@flanksource-ui/components/Forms/Formik/FormikTextInput";
import DeleteResource from "@flanksource-ui/components/SchemaResourcePage/Delete/DeleteResource";
import CanEditResource from "@flanksource-ui/components/Settings/CanEditResource";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import clsx from "clsx";
import { Form, Formik } from "formik";
import { useCallback, useMemo } from "react";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const resourceInfo = {
  name: "Topology",
  api: "incident-commander",
  table: "topologies"
} as const;

export type TopologyResource = {
  id: string;
  name: string;
  namespace: string;
  labels: Record<string, string>;
  source: string;
  spec: Record<string, any>;
  agent_id?: string;
  agent_details: {
    id: string;
    name: string;
  };
};

type TopologyResourceFormProps = {
  topology?: SchemaResourceI;
  onBack?: () => void;
  onCancel?: () => void;
  footerClassName?: string;
  onSuccess?: () => void;
  isModal?: boolean;
};

export default function TopologyResourceForm({
  topology,
  onBack,
  footerClassName = "bg-gray-100 p-4",
  onSuccess = () => {},
  onCancel = () => {},
  isModal = false
}: TopologyResourceFormProps) {
  const navigate = useNavigate();

  const { mutate: createResource, isLoading: isCreatingResource } =
    useSettingsCreateResource(resourceInfo, onSuccess);

  const { mutate: updateResource, isLoading: isUpdatingResource } =
    useSettingsUpdateResource(resourceInfo!, topology, {
      onSuccess: () => {
        navigate(`/settings/integrations`);
      }
    });

  const isLoading = isCreatingResource || isUpdatingResource;

  const initialValues: Omit<Partial<TopologyResource>, "id"> & {
    id?: string;
  } = useMemo(() => {
    if (topology) {
      return topology;
    }
    return {
      namespace: "default",
      source: "UI"
    };
  }, [topology]);

  const handleSubmit = useCallback(
    (
      values: Omit<Partial<TopologyResource>, "id"> & {
        id?: string;
      }
    ) => {
      if (topology) {
        updateResource(values);
      } else {
        createResource(values);
      }
    },
    [createResource, topology, updateResource]
  );

  const saveButtonText = useMemo(() => {
    if (topology) {
      return isLoading ? "Updating" : "Update";
    }
    return isLoading ? "Saving" : "Save";
  }, [isLoading, topology]);

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto">
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ isValid, handleSubmit }) => (
          <Form
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col overflow-y-auto"
          >
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
              <FormikTextInput label="Name" name="name" />
              <FormikTextInput
                label="Namespace"
                name="namespace"
                placeholder="Namespace"
                defaultValue={"default"}
              />
              <FormikKeyValueMapField label="Labels" name="labels" outputJson />
              <FormikCodeEditor
                className={clsx(
                  "flex flex-col",
                  isModal ? "h-[400px]" : "min-h-[400px] flex-1"
                )}
                label="Spec"
                fieldName="spec"
                format="yaml"
              />
            </div>
            <div className={`flex flex-col ${footerClassName}`}>
              <div className="flex flex-1 flex-row items-center justify-end space-x-4">
                <CanEditResource
                  resourceType="topologies"
                  id={topology?.id!}
                  namespace={topology?.namespace!}
                  source={topology?.source}
                  name={topology?.name!}
                  agentId={topology?.agent?.id}
                  agentName={topology?.agent?.name}
                >
                  {!topology?.id && (
                    <div className="flex flex-1 flex-row">
                      <Button
                        type="button"
                        text="Back"
                        className="btn-default btn-btn-secondary-base btn-secondary"
                        onClick={onBack}
                      />
                    </div>
                  )}
                  {!!topology?.id && (
                    <>
                      <Button
                        onClick={onCancel}
                        text="Cancel"
                        className="btn-secondary"
                      />
                      <div className="flex-1" />
                      <DeleteResource
                        resourceId={topology?.id}
                        resourceInfo={resourceInfo}
                        onDeleted={() => {
                          navigate(`/settings/integrations`);
                        }}
                      />
                    </>
                  )}

                  <Button
                    disabled={!isValid}
                    type="submit"
                    icon={
                      isLoading ? (
                        <FaSpinner className="animate-spin" />
                      ) : undefined
                    }
                    text={saveButtonText}
                    className={clsx("btn-primary")}
                  />
                </CanEditResource>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
