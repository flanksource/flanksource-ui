import { useState, useCallback, MouseEventHandler } from "react";
import clsx from "clsx";
import { SiJira } from "react-icons/si";
import { MdEmail } from "react-icons/md";
import { GrVmware } from "react-icons/gr";
import { useForm } from "react-hook-form";
import { FiUser } from "react-icons/fi";

import { Modal } from "../Modal";
import {
  AwsServiceRequest,
  AwsSupport,
  CA,
  Email,
  Jira,
  Microsoft,
  Oracle,
  Person,
  Redhat,
  ServiceNow,
  VMWare
} from "./ResponderTypes";
import { OptionsList } from "../OptionsList";
import { Step } from "../StepProgressBar";
import { Icon } from "../Icon";
import { useParams } from "react-router-dom";
import { useUser } from "../../context";
import { saveResponder } from "../../api/services/responder";
import { useLoader } from "../../hooks";
import { toastError, toastSuccess } from "../Toast/toast";

type Action = {
  label: string;
  disabled: boolean;
  handler: MouseEventHandler<HTMLButtonElement>;
  primary?: boolean;
};

type ActionButtonGroupProps = {
  previousAction?: Action;
  nextAction?: Action;
} & React.HTMLProps<HTMLDivElement>;

export const ResponderTypeOptions = [
  { label: "Email", value: "Email", icon: MdEmail },
  { label: "Jira", value: "Jira", icon: SiJira },
  { label: "ServiceNow", value: "ServiceNow", icon: "servicenow" },
  { label: "CA", value: "CA", icon: "ca" },
  { label: "AWS Support", value: "AWS Support", icon: "aws" },
  {
    label: "AWS AMS Service Request",
    value: "AWS AMS Service Request",
    icon: "aws"
  },
  { label: "Redhat", value: "Redhat", icon: "redhat" },
  { label: "Oracle", value: "Oracle", icon: "oracle_icon" },
  { label: "Microsoft", value: "Microsoft", icon: "microsoft" },
  { label: "VMWare", value: "VMWare", icon: GrVmware },
  { label: "Person", value: "Person", icon: FiUser }
];

const ResponderSteps = [
  {
    label: "Responder Type",
    position: 1,
    inProgress: true,
    finished: false
  },
  {
    label: "Details",
    position: 2,
    inProgress: false,
    finished: false
  }
];

type AddResponderFormValues = {
  to?: string;
  subject?: string;
  body?: string;
  category?: string;
  description?: string;
  project?: string;
  issueType?: string;
  summary?: string;
  product?: string;
  person?: string;
};

type formPropKey = keyof AddResponderFormValues;

export const AddResponder = () => {
  const { loading, setLoading } = useLoader();
  const { id } = useParams();
  const { user } = useUser();
  const [steps, setSteps] = useState(deepCloneSteps());
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<any>(null);
  const {
    control,
    formState: { errors },
    getValues,
    reset,
    handleSubmit
  } = useForm<AddResponderFormValues>({
    defaultValues: {
      to: "",
      subject: "",
      body: "",
      category: "",
      description: "",
      project: "",
      issueType: "",
      summary: "",
      product: "",
      person: ""
    }
  });

  function deepCloneSteps() {
    return ResponderSteps.map((v) => ({ ...v }));
  }

  const onCloseModal = useCallback(() => {
    setIsOpen(false);
    setSelectedType(null);
  }, []);

  const goToStep = (nextStep: Step, currentStep: Step) => {
    currentStep.inProgress = false;
    currentStep.finished = true;
    for (let i = steps.length - 1; i >= 0; i--) {
      steps[i].inProgress = false;
      steps[i].finished = false;
      if (steps[i] === nextStep) {
        steps[i].inProgress = true;
        break;
      }
    }
    setSteps([...steps]);
  };

  const getResponderTypeForm = () => {
    switch (selectedType?.value) {
      case "Email":
        return <Email control={control} errors={errors} />;
      case "Jira":
        return <Jira control={control} errors={errors} />;
      case "ServiceNow":
        return <ServiceNow control={control} errors={errors} />;
      case "CA":
        return <CA control={control} errors={errors} />;
      case "AWS Support":
        return <AwsSupport control={control} errors={errors} />;
      case "AWS AMS Service Request":
        return <AwsServiceRequest control={control} errors={errors} />;
      case "Redhat":
        return <Redhat control={control} errors={errors} />;
      case "Oracle":
        return <Oracle control={control} errors={errors} />;
      case "Microsoft":
        return <Microsoft control={control} errors={errors} />;
      case "VMWare":
        return <VMWare control={control} errors={errors} />;
      case "Person":
        return <Person control={control} errors={errors} />;
      default:
        return null;
    }
  };

  const onSubmit = async () => {
    await handleSubmit(
      () => {
        saveResponderDetails();
      },
      () => {}
    )();
  };

  const saveResponderDetails = async () => {
    const data = { ...getValues() };
    Object.keys(data).forEach((key: formPropKey) => {
      if (!data[key]) {
        delete data[key];
      }
    });
    const payload = {
      type: selectedType.type === "Person" ? "person" : "system",
      incident_id: id,
      acknowledge_time: new Date(Date.now())
        .toISOString()
        .replace("T", " ")
        .replace("Z", "")
        .split(".")[0],
      created_by: user.id,
      properties: {
        responderType: selectedType.label,
        ...data
      }
    };
    try {
      setLoading(true);
      await saveResponder(payload);
      toastSuccess("Added responder successfully");
    } catch (ex) {
      toastError(ex.message);
    }
    setLoading(false);
    setIsOpen(false);
  };

  const getModalTitle = () => {
    if (steps[0].inProgress) {
      return `Add Responder`;
    }
    return (
      <>
        {selectedType?.icon &&
          (typeof selectedType?.icon === "string" ? (
            <Icon className="inline-block" name={selectedType?.icon} />
          ) : (
            <selectedType.icon className="inline-block" />
          ))}{" "}
        <span>{selectedType?.label} Details</span>
      </>
    );
  };

  return (
    <div className="flex flex-1 justify-end">
      <button
        type="button"
        className="btn-secondary btn-secondary-sm text-dark-blue"
        onClick={() => {
          setSelectedType(null);
          reset();
          setIsOpen(true);
          setSteps(deepCloneSteps());
        }}
      >
        Add Responder
      </button>
      <Modal
        title={getModalTitle()}
        onClose={onCloseModal}
        open={isOpen}
        bodyClass=""
      >
        <>
          {steps[0].inProgress && (
            <div className="px-8 py-4 h-modal-body-md">
              <label
                htmlFor="responder-types"
                className="block text-base font-medium text-gray-500 my-2 font-bold"
              >
                Responder Types
              </label>
              <OptionsList
                name="responder-types"
                options={ResponderTypeOptions}
                onSelect={(e: any) => {
                  setSelectedType(e);
                  reset();
                  goToStep(steps[1], steps[0]);
                }}
                value={selectedType}
                className="h-5/6 overflow-y-scroll m-1"
              />
            </div>
          )}
          {steps[1].inProgress && (
            <div>
              <div className="px-8 py-3 h-modal-body-md">
                {getResponderTypeForm()}
                <ActionButtonGroup
                  className="absolute w-full bottom-0 left-0"
                  nextAction={{
                    label: !loading ? "Save" : "Saving...",
                    disabled: !selectedType,
                    handler: onSubmit
                  }}
                  previousAction={{
                    label: "Back",
                    disabled: !selectedType,
                    handler: () => goToStep(steps[0], steps[1])
                  }}
                />
              </div>
            </div>
          )}
        </>
      </Modal>
    </div>
  );
};

const ActionButtonGroup = ({
  previousAction,
  nextAction,
  className,
  ...rest
}: ActionButtonGroupProps) => {
  return (
    <div
      className={clsx(
        "flex rounded-t-lg justify-between bg-gray-100 px-8 pb-4 items-end",
        className
      )}
      {...rest}
    >
      <div className="flex flex-1">
        {previousAction && (
          <button
            disabled={previousAction.disabled}
            type="submit"
            className={clsx(
              !previousAction.primary
                ? "inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                : "btn-primary",
              "mt-4",
              {
                "btn-disabled": previousAction.disabled
              }
            )}
            onClick={previousAction.handler}
          >
            {previousAction.label}
          </button>
        )}
      </div>
      <div className="flex flex-1 justify-end">
        {nextAction && (
          <button
            disabled={nextAction.disabled}
            type="submit"
            className={clsx(
              !nextAction.primary
                ? "inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                : "btn-primary",
              "mt-4",
              {
                "btn-disabled": nextAction.disabled
              }
            )}
            onClick={nextAction.handler}
          >
            {nextAction.label}
          </button>
        )}
      </div>
    </div>
  );
};
