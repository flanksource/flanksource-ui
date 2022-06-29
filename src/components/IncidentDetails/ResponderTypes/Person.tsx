import { Controller } from "react-hook-form";
import { TextInput } from "../../TextInput";

export const Person = ({ control, errors }) => {
  return (
    <div className="mb-4">
      <Controller
        control={control}
        name="person"
        rules={{
          required: "Please provide valid value"
        }}
        render={({ field }) => {
          const { onChange, value } = field;
          return (
            <TextInput
              label="Person"
              id="person"
              className="w-full"
              onChange={onChange}
              value={value}
            />
          );
        }}
      />
      <p className="text-red-600 text-sm">{errors.person?.message}</p>
    </div>
  );
};
