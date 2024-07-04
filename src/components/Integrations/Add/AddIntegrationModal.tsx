import { Modal, modalHelpLinkAtom } from "@flanksource-ui/ui/Modal";
import { atom, useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import AddIntegrationForm from "./AddIntegrationForm";
import AddIntegrationOptionsList, {
  CreateIntegrationOption
} from "./steps/AddIntegrationOptionsList";

type Props = {
  refresh: () => void;
};

export const integrationsModalSubTitle = atom<string | undefined>(undefined);

export default function AddIntegrationModal({ refresh }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] =
    useState<CreateIntegrationOption>();
  const [subTitle, setSubTitle] = useAtom(integrationsModalSubTitle);
  const [, setHelpModal] = useAtom(modalHelpLinkAtom);

  // use effect, to reset the selected option when the modal is closed
  useEffect(() => {
    if (isOpen) {
      setHelpModal(undefined);
      setSelectedOption(undefined);
    }
  }, [isOpen, setHelpModal]);

  const onSelectOption = useCallback(
    (option: CreateIntegrationOption) => {
      setSelectedOption(option);
      switch (option) {
        case "Catalog Scraper":
          setSubTitle("Catalog Scraper");
          setHelpModal("/config-db");
          break;
        case "Custom Topology":
          setSubTitle("Custom Topology");
          setHelpModal("/topology");
          break;
        case "Log Backends":
          setSubTitle("Log Backends");
          setHelpModal(undefined);
          break;
        default:
          setSubTitle(option);
          setHelpModal(undefined);
          break;
      }
    },
    [setHelpModal, setSubTitle]
  );

  return (
    <>
      <button type="button" className="" onClick={() => setIsOpen(true)}>
        <AiFillPlusCircle size={32} className="text-blue-600" />
      </button>
      <Modal
        title={`Add Integration ${subTitle ? ` - ${subTitle}` : ""}`}
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        bodyClass="flex flex-col flex-1 overflow-y-auto"
        size="full"
      >
        {selectedOption ? (
          <AddIntegrationForm
            onSuccess={() => {
              refresh();
              setIsOpen(false);
            }}
            selectedOption={selectedOption}
            onBack={() => {
              setHelpModal(undefined);
              setSubTitle(undefined);
              setSelectedOption(undefined);
            }}
          />
        ) : (
          <AddIntegrationOptionsList onSelectOption={onSelectOption} />
        )}
      </Modal>
    </>
  );
}
