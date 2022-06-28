import { Controller, useForm } from "react-hook-form";
import { TextInput } from "../../TextInput";

export const Email = () => {
  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm({
    defaultValues: {
      to: "",
      subject: "",
      body: ""
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
            name="to"
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <TextInput
                  label="To"
                  id="to"
                  className="w-full"
                  onChange={onChange}
                  value={value}
                />
              );
            }}
          />
          <p className="text-red-600 text-sm">{errors.to?.message}</p>
        </div>
        <div className="mb-4">
          <Controller
            control={control}
            name="subject"
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <TextInput
                  label="Subject"
                  id="subject"
                  className="w-full"
                  onChange={onChange}
                  value={value}
                />
              );
            }}
          />
          <p className="text-red-600 text-sm">{errors.subject?.message}</p>
        </div>
        <div className="mb-4">
          <Controller
            control={control}
            name="body"
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <TextInput
                  label="Body"
                  id="body"
                  className="w-full"
                  onChange={onChange}
                  value={value}
                />
              );
            }}
          />
          <p className="text-red-600 text-sm">{errors.body?.message}</p>
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
