import Form from "@rjsf/core";
import { useEffect } from "react";

const theme = { widgets: { test: () => <div>test</div> } };
const ThemedForm = withTheme(theme);

// const exampleSchema = {
//   title: "Todo",
//   type: "object",
//   required: ["title"],
//   properties: {
//     title: { type: "string", title: "Title", default: "A new task" },
//     done: { type: "boolean", title: "Done?", default: false }
//   }
// };

// const log = (type) => console.log.bind(console, type);

export function JsonForm({ schema }) {
  useEffect(() => {
    console.log("schema", schema);
  }, []);

  return (
    <Form
      schema={schema}
      onChange={(o) => {
        console.log("changed", o);
      }}
      onSubmit={(o) => {
        console.log("submit", o);
      }}
      onError={(o) => {
        console.log("error", o);
      }}
    />
  );
}
