import { useCallback, useMemo, useState } from "react";
import convertToYup, { Config } from "json-schema-yup-transformer";
import { AnyObject, ValidateOptions } from "yup/lib/types";
import { useJsonSchemaQuery } from "../api/query-hooks/useSchemaQuery";
import {
  JSONSchema,
  JSONSchema as JSONSchema7
} from "json-schema-yup-transformer/dist/schema/types";
import { Resolver } from "@stoplight/json-ref-resolver";

const useJsonToYupValidator = (schemaName?: string, jsonConfig?: Config) => {
  const [config, setConfig] = useState(jsonConfig);
  const { data } = useJsonSchemaQuery(schemaName);

  const yupValidator = useMemo(async () => {
    let schema = await resolveSchema(data?.data);
    return convertToYup(schema, config);
  }, [config, data]);

  const validator = useCallback(
    async (value: any, options?: ValidateOptions<AnyObject>) => {
      try {
        (await yupValidator)?.validateSync(value, options);
        return "";
      } catch (err: any) {
        return `${err.message}: At ${err.path}`;
      }
    },
    [yupValidator]
  );

  return { validator, setConfig };
};

/**
 * Resolves $ref property of JSON schema.
 *
 * @param schema JSON schema.
 */
const resolveSchema = async (schema?: JSONSchema7 | null) => {
  if (!schema) return {};
  if (!schema["$ref"] || schema["properties"]) return schema;

  const refPath = schema["$ref"].split("/");
  const resolveResult = await new Resolver().resolve(
    resolveMissingType({ definitions: schema.definitions })
  );
  return { ...schema, ...resolveResult.result?.definitions?.[refPath[2]] };
};

/**
 * Fix for properties with missing type. `json-schema-yup-transformer` throws error when properties is missing type.
 *
 * @param schema JSON schema.
 */
const resolveMissingType = (schema: JSONSchema) => {
  return Object.entries(schema).reduce(
    (prev, [key, value]) => {
      if (typeof value === "object" && !Array.isArray(value)) {
        Object.assign(prev, { [key]: resolveMissingType(value) });
        if ("additionalProperties" in value && !("type" in value)) {
          Object.assign(prev, { [key]: { ...value, type: "object" } });
        }
      }
      return prev;
    },
    { ...schema }
  );
};

export default useJsonToYupValidator;
