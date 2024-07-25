import clsx from "clsx";
import { NodeInputProps } from "./helpers";

export function NodeInputDefault(props: NodeInputProps) {
  const { node, attributes, value = "", setValue, disabled } = props;

  // Some attributes have dynamic JavaScript - this is for example required for WebAuthn.
  const onClick = () => {
    // This section is only used for WebAuthn. The script is loaded via a <script> node
    // and the functions are available on the global window level. Unfortunately, there
    // is currently no better way than executing eval / function here at this moment.
    if (attributes.onclick) {
      // eslint-disable-next-line no-new-func
      const run = new Function(attributes.onclick);
      run();
    }
  };

  const hasError = node.messages.find(({ type }) => type === "error")
    ? "error"
    : undefined;

  // Render a generic text input field.
  return (
    <div className="space-y-1">
      <label htmlFor={attributes.name} className="form-label">
        {node.meta.label?.text}
      </label>
      <div className="mt-1">
        <input
          className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          id={attributes.name}
          type={attributes.type}
          title={node.meta.label?.text}
          onClick={onClick}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          name={attributes.name}
          value={value}
          disabled={attributes.disabled || disabled}
        />
        {!!node.messages.length && (
          <div className={clsx("mt-2", { "text-sm text-red-600": hasError })}>
            {node.messages.map(({ text, id }, k) => (
              <span key={`${id}-${k}`} data-testid={`ui/message/${id}`}>
                {text}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
