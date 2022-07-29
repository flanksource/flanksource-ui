import { useState, useCallback, MouseEventHandler, useMemo } from "react";
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

export const ResponderPropsKeyToLabelMap = {
  to: "To",
  subject: "Subject",
  body: "Body",
  category: "Category",
  description: "Description",
  project: "Project",
  issueType: "Issue Type",
  summary: "Summary",
  product: "Product",
  person: "Person"
};

export const ResponderTypeOptions = [
  {
    label: "Email",
    value: "Email",
    icon: () => <MdEmail className="w-5 h-5 inline-block align-sub" />
  },
  {
    label: "Jira",
    value: "Jira",
    icon: () => <SiJira className="w-5 h-5 inline-block align-sub" />
  },
  {
    label: "ServiceNow",
    value: "ServiceNow",
    icon: () => (
      <Icon size="md" className="inline-block align-sub" name="servicenow" />
    )
  },
  {
    label: "CA",
    value: "CA",
    icon: () => <Icon size="md" className="inline-block align-sub" name="ca" />
  },
  {
    label: "AWS Support",
    value: "AWS Support",
    icon: () => <Icon size="md" className="inline-block align-sub" name="aws" />
  },
  {
    label: "AWS AMS Service Request",
    value: "AWS AMS Service Request",
    icon: () => <Icon size="md" className="inline-block align-sub" name="aws" />
  },
  {
    label: "Redhat",
    value: "Redhat",
    icon: () => (
      <Icon size="md" className="inline-block align-sub" name="redhat" />
    )
  },
  {
    label: "Oracle",
    value: "Oracle",
    icon: () => (
      <Icon size="md" className="inline-block align-sub" name="oracle_icon" />
    )
  },
  {
    label: "Microsoft",
    value: "Microsoft",
    icon: () => (
      <Icon size="md" className="inline-block align-sub" name="microsoft" />
    )
  },
  {
    label: "VMWare",
    value: "VMWare",
    icon: () => <GrVmware className="w-5 h-5 inline-block align-sub" />
  },
  {
    label: "Person",
    value: "Person",
    icon: () => <FiUser className="w-5 h-5 inline-block align-sub" />
  }
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

export type AddResponderFormValues = {
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

export type formPropKey = keyof AddResponderFormValues;

type AddResponderProps = {
  onSuccess?: () => void;
  onError?: () => void;
} & React.HTMLProps<HTMLDivElement>;

export const AddResponder = ({
  onSuccess = () => {},
  onError = () => {},
  className,
  ...rest
}: AddResponderProps) => {
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
      created_by: user?.id,
      properties: {
        responderType: selectedType.label,
        ...data
      }
    };
    try {
      setLoading(true);
      const result = await saveResponder(payload);
      if (!result?.error) {
        toastSuccess("Added responder successfully");
        onSuccess();
        setIsOpen(false);
      } else {
        onError();
        toastError("Adding responder failed");
      }
    } catch (ex) {
      toastError(ex.message);
      onError();
    }
    setLoading(false);
  };

  const getModalTitle = () => {
    if (steps[0].inProgress) {
      return `Add Responder`;
    }
    return (
      <div className="w-full">
        {selectedType?.icon && <selectedType.icon className="inline-block" />}{" "}
        <span>{selectedType?.label} Details</span>
      </div>
    );
  };

  return (
    <div className={clsx("flex flex-1", className)} {...rest}>
      <button
        className="underline text-blue-600 hover:text-blue-800 text-sm font-medium mt-1"
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
              <div className="px-8 py-3 h-modal-body-md mb-16">
                {getResponderTypeForm()}
                <ActionButtonGroup
                  className="absolute w-full bottom-0 left-0"
                  nextAction={{
                    label: !loading ? "Save" : "Saving...",
                    disabled: !selectedType || loading,
                    handler: onSubmit,
                    primary: true
                  }}
                  previousAction={{
                    label: "Back",
                    disabled: !selectedType || loading,
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
