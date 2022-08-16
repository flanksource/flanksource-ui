import { Controller, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import { HypothesisStatus } from "../../../api/services/hypothesis";
import { hypothesisStatusDropdownOptions } from "../../../constants/hypothesisStatusOptions";
import { useUser } from "../../../context";
import { Dropdown } from "../../Dropdown";
import { Modal } from "../../Modal";

const nextNodePath = {
  default: "root",
  root: "factor",
  factor: "solution"
};

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
  const { control, getValues, setValue, handleSubmit, watch } = useForm({
    defaultValues: {
      hypothesis: {
        status: HypothesisStatus.Possible,
        title: ""
      }
    }
  });

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
          type: nextNodePath[node?.type || "default"],
          status: getValues("hypothesis.status")
        }
      });
    }
    onHypothesisCreated();
  };
  return (
    <Modal
      open={isOpen}
      onClose={onHypothesisCreated}
      title={
        <Controller
          name="hypothesis.title"
          control={control}
          render={({ field }) => (
            <input
              className="w-72 cursor-pointer bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-500 text-base leading-6 font-normal"
              type="text"
              placeholder="Type name"
              {...field}
            />
          )}
        />
      }
      size="medium"
      bodyClass=""
    >
      <form onSubmit={(...args) => handleSubmit(onSubmit)(...args)}>
        <div className="px-8">
          <div className="mt-4">
            <Dropdown
              control={control}
              name="hypothesis.status"
              className="mb-4 w-72"
              items={hypothesisStatusDropdownOptions}
              label="State"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4 py-4 px-8 rounded-t-lg bg-gray-100">
          <input
            type="submit"
            className="bg-dark-blue text-white rounded-6px py-2 px-6 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={false}
            value="Create"
          />
        </div>
      </form>
    </Modal>
  );
};
