import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { JSONSchema } from "json-schema-yup-transformer/dist/schema/types";
import { getJsonSchema } from "../services/schema";

type Response =
  | { error: Error; data: null }
  | {
      data: JSONSchema | null;
      error: null;
    };

export const useJsonSchemaQuery = (
  schemaName?: string,
  options?: UseQueryOptions<Response, Error>
) => {
  return useQuery<Response, Error>(
    ["json_schema", schemaName],
    () => getJsonSchema(schemaName),
    options
  );
};
