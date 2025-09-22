import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { Form, Formik } from "formik";
import { FaSpinner } from "react-icons/fa";
import {
  createToken,
  CreateTokenRequest,
  CreateTokenResponse
} from "../../../api/services/tokens";
import { Permission } from "../../../api/services/rbac";
import { Button } from "../../../ui/Buttons/Button";
import { Modal } from "../../../ui/Modal";
import FormikTextInput from "../../Forms/Formik/FormikTextInput";
import FormikSelectDropdown from "../../Forms/Formik/FormikSelectDropdown";
import FormikCheckbox from "../../Forms/Formik/FormikCheckbox";
import { toastError, toastSuccess } from "../../Toast/toast";
import {
  OBJECTS,
  getActionsForObject,
  getAllObjectActions
} from "../tokenUtils";

export type TokenFormValues = CreateTokenRequest & {
  objectActions: Record<string, boolean>;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (
    response: CreateTokenResponse,
    formValues: TokenFormValues
  ) => void;
  isMcpSetup?: boolean;
};

const expiryOptions = [{ label: "Never", value: "never" }];

export default function CreateTokenForm({
  isOpen,
  onClose,
  onSuccess = () => {},
  isMcpSetup = false
}: Props) {
  const { mutate: createTokenMutation, isLoading } = useMutation({
    mutationFn: createToken,
    onSuccess: (data) => {
      toastSuccess("Token created successfully");
    },
    onError: (error: any) => {
      toastError(error.message || "Failed to create token");
    }
  });

  const allObjectActions = getAllObjectActions();

  const getInitialObjectActions = () => {
    const initialActions = Object.fromEntries(
      allObjectActions.map((objAction) => [objAction, false])
    );

    if (isMcpSetup) {
      allObjectActions
        .filter((objAction) => objAction.startsWith("mcp:"))
        .forEach((mcpAction) => {
          initialActions[mcpAction] = true;
        });
    }

    return initialActions;
  };

  const handleSubmit = (values: TokenFormValues) => {
    const selectedScopes: Permission[] = Object.entries(values.objectActions)
      .filter(([_, isChecked]) => isChecked)
      .map(([scopeId]) => {
        const [object, action] = scopeId.split(":");
        return {
          subject: "", // subject is handled at server
          object,
          action
        } as Permission;
      });

    const tokenRequest: CreateTokenRequest = {
      name: values.name,
      expiry: values.expiry,
      scope: selectedScopes
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
          objectActions: getInitialObjectActions()
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
                      Scopes
                      <p className="mt-1 text-xs text-gray-500">
                        Select the permissions to grant to this token
                      </p>
                    </div>
                    <div className="max-h-64 space-y-4 overflow-y-auto rounded-md border bg-gray-50 p-4">
                      {OBJECTS.map((object) => (
                        <div key={object} className="space-y-2">
                          <div className="text-sm font-medium text-gray-800">
                            {object}
                          </div>
                          <div className="grid grid-cols-4 gap-2 pl-4">
                            {getActionsForObject(object).map((action) => {
                              const scopeKey = `${object}:${action}`;
                              return (
                                <FormikCheckbox
                                  key={scopeKey}
                                  name={`objectActions.${scopeKey}`}
                                  label={action}
                                  labelClassName="text-sm font-normal text-gray-600"
                                  inline={true}
                                />
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
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
