import { getPlaybookParams } from "@flanksource-ui/api/services/playbooks";
import { getErrorMessage } from "@flanksource-ui/api/types/error";
import {
  PlaybookParamCodeEditor,
  PlaybookSpec
} from "@flanksource-ui/api/types/playbooks";
import FormSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/FormSkeletonLoader";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useFormikContext } from "formik";
import { useAtom } from "jotai/react";
import { useEffect, useMemo } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import PlaybookParamsFieldsRenderer from "./PlaybookParamsFieldsRenderer";
import {
  SubmitPlaybookRunFormValues,
  submitPlaybookRunFormModalSizesAtom
} from "./SubmitPlaybookRunForm";
import { getPlaybookParamDefaults } from "./playbookParamDefaults";

type PlaybookRunParamsProps = {
  isResourceRequired: boolean;
  playbook: Pick<PlaybookSpec, "spec">;
  overrideParams: boolean;
};

export default function PlaybookRunParams({
  isResourceRequired = false,
  playbook,
  overrideParams = false
}: PlaybookRunParamsProps) {
  const [, setModalSize] = useAtom(submitPlaybookRunFormModalSizesAtom);

  const { setFieldValue, values } =
    useFormikContext<SubmitPlaybookRunFormValues>();

  const componentId = values.component_id;
  const configId = values.config_id;
  const checkId = values.check_id;
  const playbookId = values.id;

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "playbook",
      "params",
      playbookId,
      componentId,
      configId,
      checkId
    ],
    queryFn: () =>
      getPlaybookParams({
        playbookId,
        component_id: componentId,
        config_id: configId,
        check_id: checkId
      }),
    enabled: !!componentId || !!configId || !!checkId,
    keepPreviousData: false,
    cacheTime: 0,
    staleTime: 0
  });

  // parameters that depend on a resource are resolved by the API, the rest are
  // read straight off the spec and are always available
  const parameters = useMemo(
    () => (isResourceRequired ? data?.params : playbook.spec?.parameters) ?? [],
    [data?.params, isResourceRequired, playbook.spec?.parameters]
  );

  // update modal size when params are loaded
  useEffect(() => {
    data?.params
      ?.filter((param) => param.type === "code")
      .forEach((param) => {
        const size = (param as PlaybookParamCodeEditor).properties?.size;
        if (size && size !== "medium") {
          setModalSize({ width: size, height: "full" });
          return;
        }
      });
  }, [data, setModalSize]);

  // API resolved params only arrive after mount, so their defaults are seeded
  // here rather than in the form's initial values. We don't want to override
  // form values if they are already set by user action, like for instance when
  // re-running a playbook with the same parameters
  useEffect(() => {
    if (overrideParams || !data?.params) {
      return;
    }
    Object.entries(getPlaybookParamDefaults(data.params)).forEach(
      ([name, value]) => setFieldValue(`params.${name}`, value)
    );
  }, [data?.params, overrideParams, setFieldValue]);

  // if no resource is selected, show a message and hide the parameters
  if (!componentId && !configId && !checkId && isResourceRequired) {
    return (
      <div className="flex flex-row items-center text-gray-400">
        <FaExclamationTriangle className="mr-2 inline-block" />
        <span>Please select a resource to see the parameters.</span>
      </div>
    );
  }

  if (isLoading && isResourceRequired) {
    return <FormSkeletonLoader />;
  }

  if (error) {
    return (
      <div className="flex flex-row items-center text-red-600">
        <FaExclamationTriangle className="mr-2 inline-block" />
        <span>{getErrorMessage(error)}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2">
        {parameters.length > 0 ? (
          parameters.map((i) => (
            <div
              className={clsx(
                `flex gap-2`,
                i.type !== "checkbox" && i.label ? "flex-row" : "flex-col"
              )}
              key={i.name}
            >
              {i.type !== "checkbox" && i.label && (
                <div className="w-36 py-2">
                  <label
                    htmlFor={`params.${i.name}`}
                    className="form-label mb-0"
                  >
                    {i.label}
                  </label>
                </div>
              )}
              <div className="flex flex-1 flex-col">
                <PlaybookParamsFieldsRenderer params={i} key={i.name} />
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-gray-400">
            No parameters for this playbook.
          </div>
        )}
      </div>
    </div>
  );
}
