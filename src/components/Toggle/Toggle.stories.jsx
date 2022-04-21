import { useState } from "react";
import { Toggle } from "./index";

export default {
  title: "Toggle",
  component: Toggle
};

const Template = (arg) => {
  const [value, setValue] = useState(false);
  const toogleHandler = () => setValue((prevValue) => setValue(!prevValue));
  return <Toggle value={value} onChange={toogleHandler} {...arg} />;
};

export const Variant1 = Template.bind({});
Variant1.args = {
  label: "label",
  help: "help help help"
};
