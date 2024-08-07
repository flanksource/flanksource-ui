import { Roles } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import clsx from "clsx";
import React from "react";
import { useForm } from "react-hook-form";
import { AuthorizationAccessCheck } from "../Permissions/AuthorizationAccessCheck";

export type InviteUserFormValue = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export type InviteUserFormProps = Omit<
  React.HTMLProps<HTMLDivElement>,
  "onSubmit"
> & {
  onSubmit: (val: InviteUserFormValue) => void;
  closeModal: () => void;
};

const defaultFormValue = {
  firstName: "",
  lastName: "",
  email: "",
  role: ""
};

const allRoles = Object.keys(Roles);

export function InviteUserForm({
  onSubmit,
  className,
  closeModal,
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
  const handleCancel = () => {
    reset();
    closeModal();
  };

  return (
    <div className={clsx(className)} {...rest}>
      <form
        className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
        onSubmit={handleSubmit(onSubmitFn)}
        noValidate
      >
        <div>
          <label className="form-label" htmlFor="firstName">
            First name
          </label>
          <div className="mt-1">
            <input
              id="firstName"
              {...register("firstName", {
                required: "required"
              })}
              type="text"
              className="h-full w-full rounded-md border-gray-300 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {errors.firstName && (
            <span className="text-sm text-red-600">
              Please provide valid first name
            </span>
          )}
        </div>
        <div>
          <label className="form-label" htmlFor="lastName">
            Last name
          </label>
          <div className="mt-1">
            <input
              id="lastName"
              {...register("lastName", {
                required: "required"
              })}
              type="text"
              className="h-full w-full rounded-md border-gray-300 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {errors.lastName && (
            <span className="text-sm text-red-600">
              Please provide valid last name
            </span>
          )}
        </div>
        <div>
          <label htmlFor="email" className="form-label">
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
              className="h-full w-full rounded-md border-gray-300 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              type="email"
            />
          </div>
          {errors.email && (
            <span className="text-sm text-red-600">{errors.email.message}</span>
          )}
        </div>
        <div>
          <label htmlFor="role" className="form-label">
            Role
          </label>
          <div className="mt-1">
            <select
              id="role"
              className={clsx(
                "inline-block w-full rounded-md border-gray-300 shadow-sm"
              )}
              {...register("role", {
                required: "Please select any role"
              })}
            >
              <option value="">select role</option>
              {allRoles.map((role) => {
                return <option key={role}>{role}</option>;
              })}
            </select>
          </div>
          {errors.role && (
            <span className="text-sm text-red-600">{errors.role.message}</span>
          )}
        </div>
        <div className="sm:col-span-2">
          <AuthorizationAccessCheck resource={tables.identities} action="write">
            <button type="submit" className="btn-primary float-right">
              Invite user
            </button>
          </AuthorizationAccessCheck>
          <button
            type="reset"
            onClick={handleCancel}
            className="btn-secondary float-right mr-4 px-3 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
