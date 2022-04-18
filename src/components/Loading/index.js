import { Oval } from "react-loading-icons";

export function Loading({ text = "Loading..." }) {
  return (
    <div className="flex justify-center items-center">
      <Oval stroke="gray" height="1.5em" />
      <span className="text-sm ml-3">{text}</span>
    </div>
  );
}
