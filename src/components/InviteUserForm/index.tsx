import clsx from "clsx";
import React from "react";
import { useForm } from "react-hook-form";

export type InviteUserFormValue = {
  firstName: string;
  lastName: string;
  email: string;
};

export type InviteUserFormProps = Omit<
  React.HTMLProps<HTMLDivElement>,
  "onSubmit"
> & {
  onSubmit: (val: InviteUserFormValue) => void;
};

const defaultFormValue = {
  firstName: "",
  lastName: "",
  email: ""
};

export function InviteUserForm({
  onSubmit,
  className,
  ...rest
}: InviteUserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: defaultFormValue
  });
  const onSubmitFn = async (data: InviteUserFormValue) => {
    onSubmit(data);
  };

  return (
    <div className={clsx(className)} {...rest}>
      <form
        className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
        onSubmit={handleSubmit(onSubmitFn)}
        noValidate
      >
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="firstName"
          >
            First name
          </label>
          <div className="mt-1">
            <input
              id="firstName"
              {...register("firstName", {
                required: "required"
              })}
              type="text"
              className="h-full shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2 sm:text-sm border-gray-300 rounded-md w-full"
            />
          </div>
          {errors.firstName && (
            <span className="text-red-600 text-sm">
              Please provide valid first name
            </span>
          )}
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="lastName"
          >
            Last name
          </label>
          <div className="mt-1">
            <input
              id="lastName"
              {...register("lastName", {
                required: "required"
              })}
              type="text"
              className="h-full shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2 sm:text-sm border-gray-300 rounded-md w-full"
            />
          </div>
          {errors.lastName && (
            <span className="text-red-600 text-sm">
              Please provide valid first last
            </span>
          )}
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <div className="mt-1">
            <input
              id="email"
              {...register("email", {
                required: "Please provide valid email",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Entered value does not match email format"
                }
              })}
              className="h-full shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2 sm:text-sm border-gray-300 rounded-md w-full"
              type="email"
            />
          </div>
          {errors.email && (
            <span className="text-red-600 text-sm">{errors.email.message}</span>
          )}
        </div>
        <div className="sm:col-span-2">
          <button type="submit" className="btn-primary float-right">
            Invite user
          </button>
          <button
            type="reset"
            onClick={() => {
              reset();
            }}
            className="px-3 py-2 btn-secondary float-right mr-4"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
