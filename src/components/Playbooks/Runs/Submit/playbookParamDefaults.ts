// Resolves the `default` declared on playbook parameters into form values,
// parsing code parameters according to the language they are written in.
import { PlaybookParam } from "@flanksource-ui/api/types/playbooks";
import YAML from "yaml";

function parseDefaultValue(parameter: PlaybookParam) {
  // checkbox values are held as strings, but a spec default may be a boolean
  if (parameter.type === "checkbox") {
    return String(parameter.default);
  }
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

export function getPlaybookParamDefaults(parameters: PlaybookParam[] = []) {
  return Object.fromEntries(
    parameters
      .filter((parameter) => parameter.default !== undefined)
      .map((parameter) => [parameter.name, parseDefaultValue(parameter)])
  );
}
