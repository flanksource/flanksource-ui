import { IItem } from "../../types/IItem";

interface IProps {
  name: string;
  options: IItem[];
  value: string | number;
  onChange: (v?: string | number) => void;
  className?: string;
}

export function RadioOptionsGroup({
  name,
  options,
  value,
  onChange,
  className
}: IProps) {
  return (
    <div className={className}>
      {options.map((option) => (
        <div key={option.value} className="form-check">
          <label className="form-check-label flex items-center space-x-2 text-gray-800 hover:font-medium">
            <input
              className="mt-1 w-4 cursor-pointer rounded-full border border-gray-300 transition duration-100 checked:bg-blue-600 focus:outline-none"
              type="radio"
              name={name}
              id={`id-${option.value}`}
              checked={value === option.value}
              onChange={() => onChange(option.value ?? undefined)}
            />
            {option.icon}
            <span>{option.description}</span>
          </label>
        </div>
      ))}
    </div>
  );
}
