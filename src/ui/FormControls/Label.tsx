import { BsAsterisk } from "react-icons/bs";

export function Label({
  label,
  required
}: {
  label?: string;
  required?: boolean;
}) {
  if (!label) {
    return null;
  }
  return (
    <label className="form-label flex flex-row items-center">
      {label}
      {required && <BsAsterisk className="pl-0.5 text-gray-500" />}
    </label>
  );
}
