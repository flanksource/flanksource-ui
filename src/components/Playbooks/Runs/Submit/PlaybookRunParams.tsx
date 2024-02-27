import { getPlaybookParams } from "@flanksource-ui/api/services/playbooks";
import { PlaybookParam } from "@flanksource-ui/api/types/playbooks";
import FormSkeletonLoader from "@flanksource-ui/components/SkeletonLoader/FormSkeletonLoader";
import { useQuery } from "@tanstack/react-query";
import { useFormikContext } from "formik";
import { useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import YAML from "yaml";
import PlaybookParamsFieldsRenderer from "./PlaybookParamsFieldsRenderer";
import { SubmitPlaybookRunFormValues } from "./SubmitPlaybookRunForm";

function parseCodeDefaultValue(parameter: PlaybookParam) {
  if (parameter.type !== "code" || !parameter.default) {
    return parameter.default;
  }
  const language = parameter.properties?.language ?? "yaml";
  if (language === "yaml") {
    return YAML.parse(parameter.default.replace(/^'(.+)'$/, "$1"));
  }
  if (language === "json") {
    return JSON.parse(parameter.default);
  }
  return parameter.default;
}

export default function PlaybookRunParams() {
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
    enabled: !!componentId || !!configId || !!checkId
  });

  // After the params are loaded, set the default values for the form
  useEffect(() => {
    if (data?.params && data.params.length > 0) {
      data.params.forEach((param) => {
        if (param.default !== undefined) {
          const defaultValue = parseCodeDefaultValue(param);
          setFieldValue(`params.${param.name}`, defaultValue);
        }
      });
    }
  }, [data, setFieldValue]);

  // if no resource is selected, show a message and hide the parameters
  if (!componentId && !configId && !checkId) {
    return (
      <div className="text-gray-400 flex flex-row items-center">
        <FaExclamationTriangle className="inline-block mr-2" />
        <span>Please select a resource to see the parameters.</span>
      </div>
    );
  }

  if (isLoading) {
    return <FormSkeletonLoader />;
  }

  const parameters = data?.params;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2">
        {parameters && parameters.length > 0 ? (
          parameters.map((i) => (
            <div className="flex flex-row gap-2" key={i.name}>
              {i.type !== "checkbox" && (
                <div className="w-36 py-2">
                  <label
                    htmlFor={`params.${i.name}`}
                    className="form-label mb-0"
                  >
                    {i.label}
                  </label>
                </div>
              )}
              <div className="flex flex-col flex-1">
                <PlaybookParamsFieldsRenderer params={i} key={i.name} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-400 py-6">
            No parameters for this playbook.
          </div>
        )}
      </div>
    </div>
  );
}
