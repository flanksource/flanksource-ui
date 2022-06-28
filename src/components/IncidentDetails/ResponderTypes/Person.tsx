import { Controller, useForm } from "react-hook-form";
import { TextInput } from "../../TextInput";

export const Person = () => {
  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm({
    defaultValues: {
      person: ""
    }
  });

  const onSubmit = (e: any) => {
    console.log(e);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Controller
            control={control}
            name="person"
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
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
