import { UserFormValue } from "@flanksource-ui/components/Users/UserForm";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "../services/users";

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
