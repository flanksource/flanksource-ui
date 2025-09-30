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
import { toastError, toastSuccess } from "../../Toast/toast";
import {
  OBJECTS,
  getActionsForObject,
  getAllObjectActions
} from "../tokenUtils";
import TokenScopeFieldsGroup from "./TokenScopeFieldsGroup";

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
      // For MCP setup, pre-select mcp:* (will be shown in Custom mode)
      allObjectActions
        .filter((objAction) => objAction.startsWith("mcp:"))
        .forEach((mcpAction) => {
          initialActions[mcpAction] = true;
        });
    } else {
      // For regular token creation, apply "Read" preset by default
      // This matches the default selected scope in TokenScopeFieldsGroup
      OBJECTS.forEach((object) => {
        const actions = getActionsForObject(object);
        if (actions.includes("read")) {
          initialActions[`${object}:read`] = true;
        } else if (object === "mcp" && actions.includes("*")) {
          initialActions[`${object}:*`] = true;
        }
      });
    }

    return initialActions;
  };

  const handleFormSubmit = (values: TokenFormValues) => {
    const selectedScopes: Permission[] = Object.entries(values.objectActions)
      .filter(([_, isChecked]) => isChecked === true)
      .map(([scopeId]) => {
        // Split by first colon only to handle cases like "playbooks:playbook:run"
        const colonIndex = scopeId.indexOf(":");
        const object = scopeId.substring(0, colonIndex);
        const action = scopeId.substring(colonIndex + 1);
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
        onSubmit={handleFormSubmit}
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

                  <TokenScopeFieldsGroup isMcpSetup={isMcpSetup} />
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
