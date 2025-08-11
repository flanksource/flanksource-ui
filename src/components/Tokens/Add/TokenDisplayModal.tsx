import { useState } from "react";
import { FaCopy, FaEye, FaEyeSlash } from "react-icons/fa";
import { CreateTokenResponse } from "../../../api/services/tokens";
import { Button } from "../../../ui/Buttons/Button";
import { Modal } from "../../../ui/Modal";
import { toastSuccess } from "../../Toast/toast";
import { TokenFormValues } from "./CreateTokenForm";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  tokenResponse: CreateTokenResponse;
  formValues?: TokenFormValues;
  isMcp?: boolean;
};

export default function TokenDisplayModal({
  isOpen,
  onClose,
  tokenResponse,
  formValues,
  isMcp = false
}: Props) {
  const [showToken, setShowToken] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tokenResponse.payload.token);
    toastSuccess("Token copied to clipboard");
  };

  const maskedToken = tokenResponse.payload.token.replace(/./g, "•");

  return (
    <Modal
      title="Token Created Successfully"
      onClose={onClose}
      open={isOpen}
      bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
    >
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
          <h3 className="mb-2 text-lg font-bold text-yellow-800">
            ⚠️ Important Security Notice
          </h3>
          <p className="text-yellow-700">
            This token will only be displayed once. Please copy and store it
            securely. You won't be able to see it again after closing this
            dialog.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Token Name:
          </label>
          <div className="rounded-md bg-gray-100 px-3 py-2 text-sm">
            {formValues?.name}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Access Token:
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 break-all rounded-md bg-gray-100 px-3 py-2 font-mono text-sm">
              {showToken ? tokenResponse.payload.token : maskedToken}
            </div>
            <Button
              onClick={() => setShowToken(!showToken)}
              className="btn-secondary p-2"
              icon={showToken ? <FaEyeSlash /> : <FaEye />}
            />
            <Button
              onClick={copyToClipboard}
              className="btn-secondary p-2"
              icon={<FaCopy />}
            />
          </div>
        </div>

        {isMcp && (
          <div className="rounded-md border border-green-200 bg-green-50 p-4">
            <h4 className="mb-2 font-medium text-green-800">MCP Setup:</h4>
            <div>hello</div>
          </div>
        )}

        <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
          <h4 className="mb-2 font-medium text-blue-800">
            Usage Instructions:
          </h4>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• Use this token for API authentication</li>
            <li>
              • Basic auth:
              <ul className="px-6">
                <li>
                  Username:{" "}
                  <code className="rounded bg-blue-100 px-1">token</code>
                </li>
                <li>
                  Password:{" "}
                  <code className="rounded bg-blue-100 px-1">
                    &lt;YOUR_TOKEN&gt;
                  </code>
                </li>
              </ul>
            </li>
            <li>
              • Include it in the Authorization header:{" "}
              <code className="rounded bg-blue-100 px-1">
                Basic base64(token:&lt;YOUR_TOKEN&gt;)
              </code>
            </li>
            <li>• Store it securely and never share it publicly</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-row justify-end gap-4 p-4">
        <Button text="Close" onClick={onClose} className="btn-primary" />
      </div>
    </Modal>
  );
}
