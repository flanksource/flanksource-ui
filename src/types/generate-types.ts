import SwaggerParser from "@apidevtools/swagger-parser";
import fs from "fs";
import openapiTS, { OpenAPI2, SchemaObject } from "openapi-typescript";

const nodeTypeRef = (node: SchemaObject) => {
  const fkMatch = node.description?.match(/Foreign Key.*table='(\w+)'./);
  if (fkMatch?.length === 2) {
    console.log(node);
    return `['id', '${fkMatch[1]}']`;
  }
  return;
};

const nodeTypeDate = (node: SchemaObject) => {
  const fkMatch = node.format?.match("timestamp without time zone");
  if (fkMatch?.length) {
    return "'TimeStampStr'";
  }
  return;
};

async function load() {
  // example 1: load [object] as schema (JSON only)
  const schema = fs.readFileSync("./src/types/im.json", "utf8"); // must be OpenAPI JSON

  const output = await openapiTS(JSON.parse(schema), {
    formatter(node: SchemaObject) {
      const ref = nodeTypeRef(node);
      if (ref) return ref;

      return nodeTypeDate(node);
    }
  });

  console.log("writing");
  fs.writeFileSync("./src/types/im-gen.ts", output, { flag: "w+" });
}

async function parse() {
  const parsed = (await SwaggerParser.parse(
    "./src/types/im.json"
  )) as any as OpenAPI2;
  console.log(parsed?.definitions?.hypothesis);
}

// load();
parse();
