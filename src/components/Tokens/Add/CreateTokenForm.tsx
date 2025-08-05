import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { Form, Formik } from "formik";
import { FaSpinner } from "react-icons/fa";
import {
  createToken,
  CreateTokenRequest,
  CreateTokenResponse
} from "../../../api/services/tokens";
import { Button } from "../../../ui/Buttons/Button";
import { Modal } from "../../../ui/Modal";
import FormikTextInput from "../../Forms/Formik/FormikTextInput";
import FormikSelectDropdown from "../../Forms/Formik/FormikSelectDropdown";
import { toastError, toastSuccess } from "../../Toast/toast";

export type TokenFormValues = CreateTokenRequest;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (
    response: CreateTokenResponse,
    formValues: TokenFormValues
  ) => void;
};

const expiryOptions = [{ label: "Never", value: "never" }];

export default function CreateTokenForm({
  isOpen,
  onClose,
  onSuccess = () => {}
}: Props) {
  const { mutate: createTokenMutation, isLoading } = useMutation({
    mutationFn: createToken,
    onSuccess: (data, variables) => {
      toastSuccess("Token created successfully");
      onSuccess(data, variables);
    },
    onError: (error: any) => {
      toastError(error.message || "Failed to create token");
    }
  });

  const handleSubmit = (values: TokenFormValues) => {
    createTokenMutation(values);
  };

  return (
    <Modal
      title="Create new token"
      onClose={onClose}
      open={isOpen}
      bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
    >
      <Formik<TokenFormValues>
        initialValues={{
          name: "",
          expiry: "never"
        }}
        onSubmit={handleSubmit}
        validate={(values) => {
          const errors: any = {};
          if (!values.name.trim()) {
            errors.name = "Name is required";
          }
          return errors;
        }}
      >
        {({ handleSubmit, isValid }) => (
          <Form
            className="flex flex-1 flex-col overflow-y-auto"
            onSubmit={handleSubmit}
          >
            <div className={clsx("my-2 flex h-full flex-col overflow-y-auto")}>
              <div className={clsx("mb-2 flex flex-col overflow-y-auto px-2")}>
                <div className="flex flex-col space-y-4 overflow-y-auto p-4">
                  <FormikTextInput
                    name="name"
                    label="Name"
                    required
                    hint="A descriptive name for this token"
                  />
                  <FormikSelectDropdown
                    name="expiry"
                    label="Expiry"
                    options={expiryOptions}
                    hint="When this token should expire"
                  />
                </div>
              </div>
            </div>
            <div
              className={clsx(
                "flex items-center justify-end bg-gray-100 px-5 py-4"
              )}
            >
              <Button
                icon={
                  isLoading ? <FaSpinner className="animate-spin" /> : undefined
                }
                type="submit"
                text={isLoading ? "Creating..." : "Create Token"}
                className="btn-primary"
                disabled={!isValid || isLoading}
              />
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
