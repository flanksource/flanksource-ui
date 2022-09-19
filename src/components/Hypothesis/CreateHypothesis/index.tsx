import { Controller, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import {
  getHypothesisChildType,
  HypothesisStatus
} from "../../../api/services/hypothesis";
import { hypothesisStatusDropdownOptions } from "../../../constants/hypothesisStatusOptions";
import { useUser } from "../../../context";
import { capitalizeFirstLetter } from "../../../utils/common";
import { Modal } from "../../Modal";
import { ReactSelectDropdown } from "../../ReactSelectDropdown";

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
      size="slightly-small"
      bodyClass=""
    >
      <form onSubmit={(...args) => handleSubmit(onSubmit)(...args)}>
        <div className="p-8 space-y-4">
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-gray-700 block"
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
                  className="w-full cursor-pointer bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-500 text-base leading-6 font-normal"
                  type="text"
                  placeholder="Type name"
                  {...field}
                />
              )}
            />
          </div>
          <ReactSelectDropdown
            control={control}
            name="hypothesis.status"
            className="mb-4 w-72"
            items={hypothesisStatusDropdownOptions}
            label="State"
            value={status}
          />
        </div>
        <div className="flex justify-end mt-4 py-4 px-8 rounded-b-lg bg-gray-100">
          <input
            type="submit"
            className="bg-dark-blue text-white rounded-6px py-2 px-6 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={false}
            value="Create"
          />
        </div>
      </form>
    </Modal>
  );
};
