type ResourceAccess = "deny" | "default" | "allow";

type TriStateAccessSwitchProps = {
  value: ResourceAccess;
  onChange: (value: ResourceAccess) => void;
  disabled?: boolean;
};

const ACCESS_LABEL: Record<ResourceAccess, string> = {
  deny: "Deny",
  default: "Default",
  allow: "Allow"
};

const ACCESS_LABEL_CLASSNAME: Record<ResourceAccess, string> = {
  deny: "text-red-600",
  default: "text-gray-500",
  allow: "text-green-600"
};

const TRACK_CLASSNAME: Record<ResourceAccess, string> = {
  deny: "bg-red-500",
  default: "bg-gray-400",
  allow: "bg-green-600"
};

const POSITION_BY_ACCESS: Record<ResourceAccess, number> = {
  deny: 0,
  default: 1,
  allow: 2
};

const ACCESS_ORDER: ResourceAccess[] = ["deny", "default", "allow"];

export default function TriStateAccessSwitch({
  value,
  onChange,
  disabled = false
}: TriStateAccessSwitchProps) {
  const position = POSITION_BY_ACCESS[value] * 14;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`relative inline-flex h-4 w-11 overflow-hidden rounded-full p-0.5 transition-colors ${TRACK_CLASSNAME[value]} ${disabled ? "opacity-60" : ""}`}
      >
        <span
          className="pointer-events-none absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform"
          style={{ transform: `translateX(${position}px)` }}
        />

        {ACCESS_ORDER.map((option) => (
          <button
            key={option}
            type="button"
            className="relative z-10 h-full flex-1"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (!disabled) {
                onChange(option);
              }
            }}
            disabled={disabled}
            aria-pressed={value === option}
            aria-label={`Set access to ${ACCESS_LABEL[option]}`}
          />
        ))}
      </div>

      <span
        className={`min-w-[40px] text-xs font-medium ${ACCESS_LABEL_CLASSNAME[value]}`}
      >
        {ACCESS_LABEL[value]}
      </span>
    </div>
  );
}
