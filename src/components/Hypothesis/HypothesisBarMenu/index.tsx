import { Fragment, useCallback, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import { BiHide, BiZoomIn } from "react-icons/bi";
import { deleteHypothesis, Hypothesis } from "../../../api/services/hypothesis";
import { createIncidentQueryKey } from "../../query-hooks/useIncidentQuery";
import { useQueryClient } from "react-query";
import { IconButton } from "../../IconButton";
import { BsTrash } from "react-icons/bs";
import { HypothesisDeleteDialog } from "../HypothesisDeleteDialog";

interface IProps {
  onDisprove: () => void;
  hypothesis: Hypothesis;
  setDeleting: (state: boolean) => void;
}

export const HypothesisBarMenu = ({
  hypothesis,
  onDisprove: onDisproveCB,
  setDeleting
}: IProps) => {
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const onDelete = useCallback(() => {
    setDeleting(true);
    const delHypo = async () => {
      try {
        setShowConfirm(false);
        await deleteHypothesis(hypothesis.id);
        const key = createIncidentQueryKey(hypothesis.incident_id);
        await queryClient.invalidateQueries(key);
        setDeleting(false);
      } catch (e) {
        setShowConfirm(false);
        setDeleting(false);
        console.error("Error while deleting", e);
      }
    };
    delHypo();
  }, [hypothesis, queryClient, setDeleting]);

  const onDisprove = () => {
    onDisproveCB();
    setShowConfirm(false);
  };

  return (
    <>
      <HypothesisDeleteDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onDelete={onDelete}
        onDisprove={onDisprove}
      />
      <Menu as="div" className="relative flex flex-initial">
        <Menu.Button className="p-0.5 min-w-7 rounded-full text-gray-400 hover:text-gray-500">
          <DotsVerticalIcon className="h-6 w-6" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 top-full w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-card  focus:outline-none ">
            <Menu.Item>
              <div
                onClick={() => setShowConfirm(true)}
                className="flex items-center w-full text-gray-700 hover:bg-gray-200 p-3"
              >
                <IconButton
                  className="bg-transparent flex items-center"
                  ovalProps={{
                    stroke: "blue",
                    height: "18px",
                    width: "18px",
                    fill: "transparent"
                  }}
                  icon={
                    <BsTrash
                      className="text-gray-600 border-0 border-l-1 border-gray-200"
                      size={18}
                    />
                  }
                />
                <span className="pl-2 text-sm block">Delete hypothesis</span>
              </div>
            </Menu.Item>

            <Menu.Item>
              <div className="flex items-center w-full text-gray-700 hover:bg-gray-200 p-3">
                <BiZoomIn />
                <span className="pl-2 text-sm block">Add solution</span>
              </div>
            </Menu.Item>

            <Menu.Item>
              <div className="flex items-center w-full text-gray-700 hover:bg-gray-200 p-3">
                <BiHide />
                <span className="pl-2 text-sm block">Edit title</span>
              </div>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};
