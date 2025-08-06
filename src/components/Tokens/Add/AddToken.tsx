import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import { CreateTokenResponse } from "../../../api/services/tokens";
import CreateTokenForm, { TokenFormValues } from "./CreateTokenForm";
import TokenDisplayModal from "./TokenDisplayModal";

type Props = {
  refresh: () => void;
};

export default function AddToken({ refresh }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const isModalOpen = searchParams.get("addToken") === "true";
  const setIsModalOpen = (isOpen: boolean) => {
    if (isOpen) {
      searchParams.set("addToken", isOpen.toString());
    } else {
      searchParams.delete("addToken");
    }
    setSearchParams(searchParams);
  };

  const [isDisplayModalOpen, setIsDisplayModalOpen] = useState(false);
  const [tokenResponse, setTokenResponse] = useState<CreateTokenResponse>();
  const [tokenFormValues, setTokenFormValues] = useState<TokenFormValues>();

  return (
    <>
      <button type="button" className="" onClick={() => setIsModalOpen(true)}>
        <AiFillPlusCircle size={32} className="text-blue-600" />
      </button>
      <CreateTokenForm
        isOpen={isModalOpen}
        onClose={() => {
          refresh();
          setIsModalOpen(false);
        }}
        onSuccess={(response, formValues) => {
          refresh();
          setTokenResponse(response);
          setTokenFormValues(formValues);
          setIsModalOpen(false);
          setIsDisplayModalOpen(true);
        }}
      />
      {tokenResponse && (
        <TokenDisplayModal
          isOpen={isDisplayModalOpen}
          onClose={() => setIsDisplayModalOpen(false)}
          tokenResponse={tokenResponse}
          formValues={tokenFormValues}
        />
      )}
    </>
  );
}
