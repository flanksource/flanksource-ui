import React, { useState } from "react";

import { JSONViewer } from "./index";

export default {
  title: "JSONViewer",
  component: JSONViewer
};

const Template = (arg) => <JSONViewer {...arg} />;

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

const JSONViewerSelectable = ({ selections: defaultSelections, ...args }) => {
  const [selections, setSelections] = useState(defaultSelections || []);
  const onClick = (idx) => {
    setSelections((selections) => {
      selections[idx] = !selections[idx];
      return [...selections];
    });
  };

  return <JSONViewer {...args} selections={selections} onClick={onClick} />;
};

export const Selectable = JSONViewerSelectable.bind({});
Selectable.args = {
  code,
  selections: [false, false, true, false, true],
  showLineNo: true
};
