import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";

import { useUser } from "../../context";
import { createPerson } from "../../api/services/users";

export function CreateUserDialog({ isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const { setUser } = useUser();

  const onSubmit = async ({ name, email }) => {
    const response = await createPerson({
      name,
      email,
      avatar: `https://i.pravatar.cc/150?u=${email}`
    });
    const person = response?.data[0];
    if (!person) {
      return;
    }
    setUser(person);
    onClose();
  };

  return (
    <Dialog as="div" className="relative z-10" open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-25" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="bg-white p-4 rounded-md">
            <Dialog.Title className="text-left">
              Switch to new user{" "}
            </Dialog.Title>
            <form
              className="block flex flex-col space-y-4 py-2 px-4 text-sm text-gray-400"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                type="text"
                {...register("name", {
                  required: true,
                  placeholder: "Name"
                })}
              />

              <input
                type="text"
                placeholder="email"
                {...register("email", { required: true })}
              />
              {errors.email && <span>This field is required</span>}
              <span className="space-x-4">
                <button
                  className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <input
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  type="submit"
                />
              </span>
            </form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
