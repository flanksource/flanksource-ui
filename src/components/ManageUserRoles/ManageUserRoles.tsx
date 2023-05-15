import clsx from "clsx";
import React from "react";
import { useForm } from "react-hook-form";
import { RegisteredUser } from "../../api/services/users";
import { Roles } from "../../context/UserAccessContext";

export type ManageUserRoleValue = {
  userId: string;
  role: string;
};

export type ManageUserRolesProps = Omit<
  React.HTMLProps<HTMLDivElement>,
  "onSubmit"
> & {
  onSubmit: (val: ManageUserRoleValue) => void;
  closeModal: () => void;
  registeredUsers: RegisteredUser[];
};

const defaultFormValue = {
  role: "",
  userId: ""
};

const allRoles = Object.keys(Roles);

export function ManageUserRoles({
  onSubmit,
  className,
  closeModal,
  registeredUsers,
  ...rest
}: ManageUserRolesProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: defaultFormValue
  });
  const onSubmitFn = async (data: ManageUserRoleValue) => {
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
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="userId"
          >
            User
          </label>
          <div className="mt-1">
            <select
              id="userId"
              className={clsx(
                "rounded-md border-gray-300 shadow-sm inline-block w-full"
              )}
              {...register("userId", {
                required: "Please select any user"
              })}
            >
              <option value="">select user</option>
              {registeredUsers.map((registeredUser) => {
                return (
                  <option key={registeredUser.id} value={registeredUser.id}>
                    {registeredUser.name}
                  </option>
                );
              })}
            </select>
          </div>
          {errors.userId && (
            <span className="text-red-600 text-sm">Please select any user</span>
          )}
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="role"
          >
            Role
          </label>
          <div className="mt-1">
            <select
              id="role"
              className={clsx(
                "rounded-md border-gray-300 shadow-sm inline-block w-full"
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
            <span className="text-red-600 text-sm">Please select any role</span>
          )}
        </div>
        <div className="sm:col-span-2">
          <button type="submit" className="btn-primary float-right">
            Update Role
          </button>
          <button
            type="reset"
            onClick={handleCancel}
            className="px-3 py-2 btn-secondary float-right mr-4"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
