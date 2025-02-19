import { getPlaybookParams } from "@flanksource-ui/api/services/playbooks";
import {
  PlaybookParam,
  PlaybookParamCodeEditor,
  PlaybookSpec
} from "@flanksource-ui/api/types/playbooks";
import FormSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/FormSkeletonLoader";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useFormikContext } from "formik";
import { useAtom } from "jotai/react";
import { useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import YAML from "yaml";
import PlaybookParamsFieldsRenderer from "./PlaybookParamsFieldsRenderer";
import {
  SubmitPlaybookRunFormValues,
  submitPlaybookRunFormModalSizesAtom
} from "./SubmitPlaybookRunForm";

function parseCodeDefaultValue(parameter: PlaybookParam) {
  if (parameter.type !== "code" || !parameter.default) {
    return parameter.default;
  }
  const language = parameter.properties?.language ?? "yaml";
  if (language === "yaml") {
    return YAML.parse(parameter.default);
  }
  if (language === "json") {
    return JSON.parse(parameter.default);
  }
  return parameter.default;
}

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

  const { data, isLoading } = useQuery({
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

  // After the params are loaded, set the default values for the form
  useEffect(() => {
    if (data?.params && data.params.length > 0) {
      data.params.forEach((param) => {
        // We don't want to override form values if they are already set by user
        // action, like for instance when re-running a playbook with the same
        // parameters, we don't want to set the default values again
        if (param.default !== undefined && !overrideParams) {
          const defaultValue = parseCodeDefaultValue(param);
          setFieldValue(`params.${param.name}`, defaultValue);
        }
      });
    }
  }, [data, overrideParams, setFieldValue]);

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

  // if no resource is required, show the playbook parameters, as they are not
  // dependent on the resource and are always available
  const parameters = isResourceRequired
    ? data?.params
    : playbook.spec?.parameters || [];

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2">
        {parameters && parameters.length > 0 ? (
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
