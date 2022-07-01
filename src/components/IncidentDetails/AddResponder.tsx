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
import { Step, StepProgressBar } from "../StepProgressBar";
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
};

const options = [
  { label: "Email", value: "Email", icon: MdEmail },
  { label: "Jira", value: "Jira", icon: SiJira },
  { label: "ServiceNow", value: "ServiceNow", icon: "service-now" },
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

const keyToLabelMap = {
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
  },
  {
    label: "Preview",
    position: 3,
    inProgress: false,
    finished: false
  }
];

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
  } = useForm({
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
        goToStep(steps[2], steps[1]);
      },
      () => {}
    )();
  };

  const getResponderDetailsList = () => {
    const values = getValues();
    const options: any[] = [];
    Object.keys(values).forEach((key) => {
      if (!values[key]) {
        return;
      }
      options.push({
        label: keyToLabelMap[key],
        value: values[key]
      });
    });
    return options;
  };

  const saveResponderDetails = async () => {
    const data = { ...getValues() };
    Object.keys(data).forEach((key) => {
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

  return (
    <div className="flex flex-1 justify-end">
      <button
        type="button"
        className="btn-primary"
        onClick={() => {
          setSelectedType(null);
          reset();
          setIsOpen(true);
          setSteps(deepCloneSteps());
        }}
      >
        Add Responder
      </button>
      <Modal title="Add Responder" onClose={onCloseModal} open={isOpen}>
        <div className="mt-3">
          <StepProgressBar className="mb-4" steps={steps} />
          {steps[0].inProgress && (
            <>
              <label
                htmlFor="responder-types"
                className="block text-base font-medium text-gray-500 my-2 font-bold"
              >
                Responder Types
              </label>
              <OptionsList
                name="responder-types"
                options={options}
                onSelect={(e: any) => {
                  setSelectedType(e);
                  reset();
                }}
                value={selectedType}
                className="h-64 overflow-y-scroll m-1"
              />
              <ActionButtonGroup
                nextAction={{
                  label: "Next",
                  disabled: !selectedType,
                  handler: () => goToStep(steps[1], steps[0])
                }}
              />
            </>
          )}
          {steps[1].inProgress && (
            <div>
              <div className="bg-white shadow-md sm:rounded-lg px-3 py-3">
                <label
                  htmlFor="responder-types"
                  className="block text-base font-medium text-gray-500 my-2 font-bold"
                >
                  {selectedType?.label} Responder Details
                </label>
                {getResponderTypeForm()}
              </div>
              <ActionButtonGroup
                nextAction={{
                  label: "Next",
                  disabled: !selectedType,
                  handler: onSubmit
                }}
                previousAction={{
                  label: "Previous",
                  disabled: !selectedType,
                  handler: () => goToStep(steps[0], steps[1])
                }}
              />
            </div>
          )}
          {steps[2].inProgress && (
            <div>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {selectedType?.icon &&
                      (typeof selectedType?.icon === "string" ? (
                        <Icon
                          className="inline-block"
                          name={selectedType?.icon}
                        />
                      ) : (
                        <selectedType.icon className="inline-block" />
                      ))}{" "}
                    {selectedType?.label} Responder Details
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 hidden">
                    Personal details and application.
                  </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    {getResponderDetailsList().map((option) => {
                      return (
                        <div
                          key={option.label}
                          className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                        >
                          <dt className="text-sm font-medium text-gray-500">
                            {option.label}
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {option.value}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </div>
              </div>
              <ActionButtonGroup
                nextAction={{
                  label: loading ? "Saving..." : "Save",
                  disabled: !selectedType || loading,
                  primary: true,
                  handler: () => {
                    saveResponderDetails();
                  }
                }}
                previousAction={{
                  label: "Previous",
                  disabled: !selectedType,
                  handler: () => goToStep(steps[1], steps[2])
                }}
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

const ActionButtonGroup = ({
  previousAction,
  nextAction
}: ActionButtonGroupProps) => {
  return (
    <div className="flex mb-4">
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
