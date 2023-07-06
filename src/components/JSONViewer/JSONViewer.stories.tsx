import React, { useState } from "react";

import { JSONViewer } from "./index";
import { ComponentStory } from "@storybook/react";

export default {
  title: "JSONViewer",
  component: JSONViewer
};

const Template: ComponentStory<typeof JSONViewer> = (arg) => (
  <JSONViewer {...arg} />
);

export const Default = Template.bind({});

const code = `
{
  "key": "value",
  "another_key": "another_value",
  "nested": {
    "nk": "nested_val"
  },
  "arr": [
    1,
    2,
    3
  ],
  "num_val": 2
}
`;

Default.args = {
  code
};

export const WithLineNo = Template.bind({});
WithLineNo.args = {
  code,
  showLineNo: true
};

const JSONViewerSelectable = ({
  selections: defaultSelections,
  ...args
}: any) => {
  const [selections, setSelections] = useState<any>(defaultSelections || []);
  const onClick = (idx: string) => {
    setSelections((selections: any) => {
      selections[idx] = !selections[idx];
      return [...selections];
    });
  };

  return <JSONViewer {...args} selections={selections} onClick={onClick} />;
};

export const Selectable: ComponentStory<typeof JSONViewerSelectable> =
  JSONViewerSelectable.bind({});

Selectable.args = {
  code,
  selections: [false, false, true, false, true],
  showLineNo: true
};
