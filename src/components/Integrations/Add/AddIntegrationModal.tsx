import { atom, useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import AddIntegrationForm from "./AddIntegrationForm";
import AddIntegrationOptionsList, { IntegrationOption } from "./steps/AddIntegrationOptionsList";
import clsx from "clsx";
import { Modal } from "@flanksource-ui/components";

type Props = {
  refresh: () => void;
};

export const integrationsModalSubTitle = atom<string | undefined>(undefined);

export default function AddIntegrationModal({ refresh }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<IntegrationOption>();
  const [subTitle, setSubTitle] = useAtom(integrationsModalSubTitle);
  // use effect, to reset the selected option when the modal is closed
  useEffect(() => {
    if (isOpen) {
      setSelectedOption(undefined);
    }
  }, [isOpen]);


  const onSelectOption = useCallback(
    (option: IntegrationOption) => {
      setSelectedOption(option);
      switch (option.name) {
        case "Catalog Scraper":
          setSubTitle("Catalog Scraper");
          break;
        case "Custom Topology":
          setSubTitle("Custom Topology");
          break;
        case "Log Backends":
          setSubTitle("Log Backends");
          break;
        default:
          setSubTitle(option.name);
          break;
      }
    },
    [setSubTitle]
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
        onBack={() =>
          setSelectedOption(undefined)
        }
        onSave={(values) => {
          console.log(values)
          setIsOpen(false)
        }}
        childClassName={clsx(
          selectedOption && {
            "w-full": true,
            "h-full": selectedOption.name !== "Catalog Scraper" && selectedOption.category !== "Scraper" && selectedOption.name !== "Custom Topology"
          }, !selectedOption && "w-full")}
      // bodyClass="flex flex-col flex-1 overflow-y-auto"
      >
        {selectedOption ? (
          <AddIntegrationForm
            onSuccess={() => {
              refresh();
              setIsOpen(false);
            }}
            selectedOption={selectedOption}
            onBack={() => {
              setSelectedOption(undefined);
            }}
          />
        ) : (
          <AddIntegrationOptionsList onSelectOption={onSelectOption} />
        )}
      </Modal >
    </>
  );
}
