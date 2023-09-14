import { IItem } from "../../types/IItem";

interface IProps {
  name: string;
  options: IItem[];
  value: string | number;
  onChange: (v?: string | number) => void;
}

export function RadioOptionsGroup({ name, options, value, onChange }: IProps) {
  return (
    <div>
      {options.map((option) => (
        <div key={option.value} className="form-check">
          <label className="flex space-x-2 items-center form-check-label text-gray-800 hover:font-medium">
            <input
              className="border border-gray-300 checked:bg-blue-600 cursor-pointer duration-100 focus:outline-none mt-1 rounded-full transition w-4"
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
