import { Controller, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import {
  HypothesisStatus,
  getHypothesisChildType
} from "../../../../api/types/hypothesis";
import { hypothesisStatusDropdownOptions } from "../../../../constants/hypothesisStatusOptions";
import { useUser } from "../../../../context";
import { Modal } from "../../../../ui/Modal";
import { capitalizeFirstLetter } from "../../../../utils/common";
import { ReactSelectDropdown } from "../../../ReactSelectDropdown";

interface IProps {
  node: any;
  api: { [k: string]: any };
  onHypothesisCreated: () => void;
  isOpen: boolean;
}

export const CreateHypothesis = ({
  node,
  api,
  onHypothesisCreated,
  isOpen
}: IProps) => {
  const { user } = useUser();
  const { control, getValues, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      hypothesis: {
        status: HypothesisStatus.Possible,
        title: ""
      }
    }
  });

  const status = watch("hypothesis.status");

  const onSubmit = async () => {
    const newNodeID = uuidv4();
    if (api?.createMutation) {
      await api.createMutation.mutateAsync({
        user,
        id: newNodeID,
        incidentId: api.incidentId,
        params: {
          parent_id: node?.id,
          title: getValues("hypothesis.title"),
          type: getHypothesisChildType(node?.type),
          status: getValues("hypothesis.status")
        }
      });
      reset();
    }
    onHypothesisCreated();
  };
  return (
    <Modal
      open={isOpen}
      onClose={onHypothesisCreated}
      title={`Create ${capitalizeFirstLetter(
        getHypothesisChildType(node?.type)
      )}`}
      size="small"
    >
      <form onSubmit={(...args) => handleSubmit(onSubmit)(...args)}>
        <div className="space-y-4 p-8">
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="hypothesis.title"
            >
              Title
            </label>
            <Controller
              name="hypothesis.title"
              control={control}
              render={({ field }) => (
                <input
                  id="hypothesis.title"
                  className="w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-base font-normal leading-6 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                  type="text"
                  placeholder="Type name"
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <div className="space-y-4 px-8 pb-8">
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="hypothesis.status"
            >
              State
            </label>
            <ReactSelectDropdown
              id="hypothesis.status"
              control={control}
              name="hypothesis.status"
              className="w-full"
              items={hypothesisStatusDropdownOptions}
              label=""
              value={status}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end rounded-b-lg bg-gray-100 px-8 py-4">
          <button
            type="submit"
            className="rounded-6px bg-dark-blue px-6 py-2 text-white hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-200 disabled:text-gray-400"
            disabled={false}
          >
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
};
