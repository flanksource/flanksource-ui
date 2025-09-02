import { useMutation, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Form, Formik } from "formik";
import { FaSpinner } from "react-icons/fa";
import {
  createToken,
  CreateTokenRequest,
  CreateTokenResponse
} from "../../../api/services/tokens";
import {
  getPermissions,
  permissionHash,
  permissionFromHash
} from "../../../api/services/rbac";
import { Button } from "../../../ui/Buttons/Button";
import { Modal } from "../../../ui/Modal";
import FormikTextInput from "../../Forms/Formik/FormikTextInput";
import FormikSelectDropdown from "../../Forms/Formik/FormikSelectDropdown";
import FormikCheckbox from "../../Forms/Formik/FormikCheckbox";
import { toastError, toastSuccess } from "../../Toast/toast";

export type TokenFormValues = CreateTokenRequest & {
  permissions: Record<string, boolean>;
};

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
  const { data: permissions = [], isLoading: permissionsLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
    enabled: isOpen
  });

  const { mutate: createTokenMutation, isLoading } = useMutation({
    mutationFn: createToken,
    onSuccess: (data) => {
      toastSuccess("Token created successfully");
    },
    onError: (error: any) => {
      toastError(error.message || "Failed to create token");
    }
  });

  const handleSubmit = (values: TokenFormValues) => {
    const denyPerms = Object.entries(values.permissions)
      .filter(([_, isChecked]) => !isChecked)
      .map(([permissionId]) => permissionId);

    const tokenRequest: CreateTokenRequest = {
      name: values.name,
      expiry: values.expiry,
      deny_permissions: denyPerms.map((p) => permissionFromHash(p))
    };

    createTokenMutation(tokenRequest, {
      onSuccess: (data) => {
        onSuccess(data, values);
      }
    });
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
          expiry: "never",
          permissions: Object.fromEntries(
            permissions.map((p) => [permissionHash(p), true])
          )
        }}
        enableReinitialize
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

                  <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-700">
                      Permissions
                      <p className="mt-1 text-xs text-gray-500">
                        Uncheck permissions you want to deny for this token
                      </p>
                    </div>
                    {permissionsLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <FaSpinner className="animate-spin text-gray-400" />
                        <span className="ml-2 text-sm text-gray-500">
                          Loading permissions...
                        </span>
                      </div>
                    ) : (
                      <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border bg-gray-50 p-3">
                        {permissions.map((permission) => {
                          const permissionKey = permissionHash(permission);
                          const displayLabel = `${permission.object}:${permission.action}`;
                          return (
                            <FormikCheckbox
                              key={permissionKey}
                              name={`permissions.${permissionKey}`}
                              label={displayLabel}
                              labelClassName="text-sm font-normal text-gray-700"
                              inline={true}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
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
