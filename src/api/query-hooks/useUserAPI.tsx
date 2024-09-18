import { UserFormValue } from "@flanksource-ui/components/Users/UserForm";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { deleteUser, updateUser } from "../services/users";

export function useDeleteUser(
  options: UseMutationOptions<
    any,
    any,
    {
      id: string;
    }
  >
) {
  return useMutation({
    mutationFn: async ({ id }) => {
      await deleteUser(id);
    },
    ...options
  });
}

export default function useUpdateUser({
  onSuccess,
  onError
}: {
  onSuccess?: (data?: {
    email: string;
    name: {
      first: string;
      last: string;
    };
  }) => void;
  onError?: (error: any) => void;
}) {
  return useMutation({
    mutationFn: async (user: UserFormValue) => {
      const res = await updateUser(user);
      return res.data ?? undefined;
    },
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error) => {
      if (onError) {
        onError(error);
      }
    }
  });
}