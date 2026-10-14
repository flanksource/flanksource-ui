import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { Form, Formik } from "formik";
import { useState } from "react";
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
import { toastSuccess } from "../../Toast/toast";
import TokenRolesFieldsGroup from "./TokenRolesFieldsGroup";
import FormikCheckbox from "@flanksource-ui/components/Forms/Formik/FormikCheckbox";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";

export type TokenFormValues = Omit<CreateTokenRequest, "roles"> & {
  roles: string[];
};

type CreateTokenFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (
    response: CreateTokenResponse,
    formValues: TokenFormValues
  ) => void;
  isMcpSetup?: boolean;
};

type CreateTokenFormContentProps = {
  onSuccess?: (
    response: CreateTokenResponse,
    formValues: TokenFormValues
  ) => void;
  isMcpSetup?: boolean;
  showFooter?: boolean;
  formId?: string;
};

const expiryOptions = [
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
  { label: "180 days", value: "180d" },
  { label: "1 year", value: "365d" },
  { label: "Server default", value: "" }
];

export function CreateTokenFormContent({
  onSuccess = () => {},
  isMcpSetup = false,
  showFooter = true,
  formId
}: CreateTokenFormContentProps) {
  const [submitError, setSubmitError] = useState<unknown>(null);

  const { mutate: createTokenMutation, isLoading } = useMutation({
    mutationFn: createToken,
    onSuccess: () => {
      setSubmitError(null);
      toastSuccess("Token created successfully");
    },
    onError: (error: unknown) => {
      setSubmitError(error);
    }
  });

  const handleFormSubmit = (values: TokenFormValues) => {
    if (isLoading) return;

    const tokenRequest: CreateTokenRequest = {
      name: values.name.trim(),
      expiry: values.expiry,
      auto_renew: values.auto_renew,
      roles: values.roles.map((role) => {
        const [namespace, name] = role.split("/");
        return { namespace, name };
      })
    };

    setSubmitError(null);

    createTokenMutation(tokenRequest, {
      onSuccess: (data) => {
        onSuccess(data, values);
      }
    });
  };

  return (
    <Formik<TokenFormValues>
      initialValues={{
        name: "",
        expiry: "90d",
        auto_renew: false,
        roles: isMcpSetup ? [] : ["mission-control-builtin/viewer"]
      }}
      enableReinitialize
      validateOnMount
      onSubmit={handleFormSubmit}
      validate={(values) => {
        const errors: { name?: string; roles?: string } = {};
        if (!values.name.trim()) {
          errors.name = "Name is required";
        }
        if (values.roles.length === 0) {
          errors.roles = "Select at least one limiting role";
        } else if (
          values.roles.some((role) => !/^[^\s/]+\/[^\s/]+$/.test(role))
        ) {
          errors.roles = "Enter each role as namespace/name";
        }
        return errors;
      }}
    >
      {({ handleSubmit, isValid }) => (
        <Form
          id={formId}
          className="flex flex-1 flex-col"
          onSubmit={handleSubmit}
        >
          <div className={clsx("my-2 flex h-full flex-col")}>
            <div className={clsx("mb-2 flex flex-col px-2")}>
              <div className="flex flex-col space-y-4 p-4">
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
                <FormikCheckbox
                  name="auto_renew"
                  label="Auto Renew"
                  hint="Renew the expiry automatically while the token is in use"
                  checkboxStyle="toggle"
                />

                <TokenRolesFieldsGroup isMcpSetup={isMcpSetup} />
              </div>
            </div>
          </div>
          {submitError != null && (
            <ErrorViewer error={submitError} className="mx-6 mb-4" />
          )}
          {showFooter && (
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
          )}
        </Form>
      )}
    </Formik>
  );
}

export default function CreateTokenForm({
  isOpen,
  onClose,
  onSuccess = () => {},
  isMcpSetup = false
}: CreateTokenFormProps) {
  return (
    <Modal
      title="Create new token"
      onClose={onClose}
      open={isOpen}
      bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
    >
      <CreateTokenFormContent onSuccess={onSuccess} isMcpSetup={isMcpSetup} />
    </Modal>
  );
}
