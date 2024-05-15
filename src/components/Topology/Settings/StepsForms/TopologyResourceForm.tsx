import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Form, Formik } from "formik";
import { useCallback, useMemo } from "react";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { TupleToUnion } from "type-fest";
import { parse } from "yaml";
import {
  useSettingsCreateResource,
  useSettingsUpdateResource
} from "../../../../api/query-hooks/mutations/useSettingsResourcesMutations";
import { Button } from "../../../../ui/Buttons/Button";
import FormSkeletonLoader from "../../../../ui/SkeletonLoader/FormSkeletonLoader";
import { FormikCodeEditor } from "../../../Forms/Formik/FormikCodeEditor";
import FormikKeyValueMapField from "../../../Forms/Formik/FormikKeyValueMapField";
import FormikTextInput from "../../../Forms/Formik/FormikTextInput";
import DeleteResource from "../../../SchemaResourcePage/Delete/DeleteResource";
import { createTopologyOptions } from "./AddTopologyOptionsList";

const selectedOptionToSpecMap = new Map<
  TupleToUnion<typeof createTopologyOptions>,
  string
>([
  [
    "Flux",
    "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/topologies/flux/flux.yaml"
  ],
  [
    "Kubernetes",
    "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/topologies/kubernetes/kubernetes.yaml"
  ],
  [
    "Prometheus",
    "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/topologies/prometheus/prometheus.yaml"
  ]
]);

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
  spec: Record<string, any>;
};

type TopologyResourceFormProps = {
  topology?: TopologyResource;
  /**
   * The selected option from the create topology options list,
   * this is used to determine the initial values for the spec field
   * and is only used when creating a new topology. When updating a topology
   * the spec field is populated with the current topology's spec and this
   * prop is ignored.
   */
  selectedOption?: TupleToUnion<typeof createTopologyOptions>;
  onBack?: () => void;
  onCancel?: () => void;
  footerClassName?: string;
  onSuccess?: () => void;
  isModal?: boolean;
};

export default function TopologyResourceForm({
  topology,
  onBack,
  selectedOption,
  footerClassName = "bg-gray-100 p-4",
  onSuccess = () => {},
  onCancel = () => {},
  isModal = false
}: TopologyResourceFormProps) {
  const navigate = useNavigate();

  const { data: spec, isLoading: isLoadingSpec } = useQuery({
    queryKey: ["Github", "mission-control-registry", selectedOption],
    queryFn: async () => {
      const url = selectedOptionToSpecMap.get(selectedOption!);
      const response = await fetch(url!);
      const data = await response.text();
      return parse(data);
    },
    enabled: !!selectedOption && selectedOption !== "Custom"
  });

  const { mutate: createResource, isLoading: isCreatingResource } =
    useSettingsCreateResource(resourceInfo, onSuccess);

  const { mutate: updateResource, isLoading: isUpdatingResource } =
    useSettingsUpdateResource(resourceInfo!, topology, {
      onSuccess: () => {
        navigate(`/settings/integrations`);
      }
    });

  const isLoading = isCreatingResource || isUpdatingResource;

  const initialValues: Omit<TopologyResource, "id"> & {
    id?: string;
  } = useMemo(() => {
    if (topology) {
      return topology;
    }
    // the spec here is determined by the selected option
    // todo: pull the specs for each option from the backend and use that to
    // determine the initial values for the spec field
    return {
      name: "",
      namespace: "default",
      labels: {},
      spec: spec ?? {}
    };
  }, [spec, topology]);

  const handleSubmit = useCallback(
    (
      values: Omit<TopologyResource, "id"> & {
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

  if (selectedOption && selectedOption !== "Custom" && isLoadingSpec) {
    return (
      <div className="flex flex-col gap-2 p-4 overflow-y-auto h-full">
        <FormSkeletonLoader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto h-full">
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ isValid, handleSubmit }) => (
          <Form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 overflow-y-auto"
          >
            <div className="flex flex-col gap-4 p-4 overflow-y-auto flex-1">
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
              <div className="flex flex-1 flex-row items-center space-x-4 justify-end">
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
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
