import { JSONSchema } from "../axios";
import { JSONSchema as JSONSchema7 } from "json-schema-yup-transformer/dist/schema/types";
import { resolve } from "../resolve";

export const getJsonSchema = (schemaName?: string) => {
  if (!schemaName) return Promise.resolve({ data: null, error: null });

  return resolve(
    JSONSchema.get<JSONSchema7>(`/schemas/${schemaName}.schema.json`)
  );
};
