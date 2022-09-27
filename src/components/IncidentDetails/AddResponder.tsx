import {
  useState,
  useCallback,
  MouseEventHandler,
  useMemo,
  useEffect
} from "react";
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
  MicrosoftPlanner,
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
import { getAll } from "../../api/schemaResources";
import { schemaResourceTypes } from "../SchemaResourcePage/resourceTypes";

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

export type ResponderOption = {
  label: string;
  value: string | undefined;
  link?: {
    label: string;
    value: string | undefined;
  };
};

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
  person: "Person",
  priority: "Priority",
  plan_id: "Plan ID",
  bucket_id: "Bucket ID",
  title: "Title",
  external_id: "External ID"
};

export const ResponderTypes = {
  email: "email",
  jira: "jira",
  serviceNow: "service_now",
  ca: "ca",
  awsSupport: "aws_support",
  awsAmsServicesRequest: "aws_ams_services_request",
  redhat: "redhat",
  oracle: "oracle",
  msPlanner: "ms_planner",
  vmware: "vmware",
  person: "person"
};

export const getResponderTitleByValue = (val: string): string | undefined => {
  return ResponderTypeOptions.find((item) => item.value === val)?.label;
};

export const ResponderTypeOptions = [
  {
    label: "Email",
    value: ResponderTypes.email,
    icon: () => <MdEmail className="w-5 h-5 inline-block" />
  },
  {
    label: "Jira",
    value: ResponderTypes.jira,
    icon: () => <SiJira className="w-5 h-5 inline-block" />
  },
  {
    label: "ServiceNow",
    value: ResponderTypes.serviceNow,
    icon: () => <Icon size="md" className="inline-block" name="servicenow" />
  },
  {
    label: "CA",
    value: ResponderTypes.ca,
    icon: () => <Icon size="md" className="inline-block" name="ca" />
  },
  {
    label: "AWS Support",
    value: ResponderTypes.awsSupport,
    icon: () => <Icon size="md" className="inline-block" name="aws" />
  },
  {
    label: "AWS AMS Service Request",
    value: ResponderTypes.awsAmsServicesRequest,
    icon: () => <Icon size="md" className="inline-block" name="aws" />
  },
  {
    label: "Redhat",
    value: ResponderTypes.redhat,
    icon: () => <Icon size="md" className="inline-block" name="redhat" />
  },
  {
    label: "Oracle",
    value: ResponderTypes.oracle,
    icon: () => <Icon size="md" className="inline-block" name="oracle_icon" />
  },
  {
    label: "Microsoft Planner",
    value: ResponderTypes.msPlanner,
    icon: () => <Icon size="md" className="inline-block" name="microsoft" />
  },
  {
    label: "VMWare",
    value: ResponderTypes.vmware,
    icon: () => <GrVmware className="w-5 h-5 inline-block" />
  },
  {
    label: "Person",
    value: ResponderTypes.person,
    icon: () => <FiUser className="w-5 h-5 inline-block" />
  }
];

const ResponderSteps = [
  {
    label: "Team",
    position: 1,
    inProgress: true,
    finished: false
  },
  {
    label: "Responder Type",
    position: 2,
    inProgress: false,
    finished: false
  },
  {
    label: "Details",
    position: 3,
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
  priority?: string;
  plan_id?: string;
  bucket_id?: string;
  title?: string;
  summary?: string;
  product?: string;
  person?: string;
  external_id?: string;
};

export type formPropKey = keyof AddResponderFormValues;

type AddResponderProps = {
  onSuccess?: () => void;
  onError?: () => void;
} & React.HTMLProps<HTMLDivElement>;

export const getOrderedKeys = (responder: any): formPropKey[] => {
  switch (responder?.type) {
    case ResponderTypes.email:
      return ["to", "subject", "body", "external_id"];
    case ResponderTypes.jira:
      return ["project", "issueType", "summary", "description", "external_id"];
    case ResponderTypes.serviceNow:
      return ["category", "description", "body", "external_id"];
    case ResponderTypes.ca:
      return ["category", "description", "body", "external_id"];
    case ResponderTypes.awsSupport:
      return ["category", "description", "body", "external_id"];
    case ResponderTypes.awsAmsServicesRequest:
      return ["category", "description", "body", "external_id"];
    case ResponderTypes.redhat:
      return ["product", "category", "description", "body", "external_id"];
    case ResponderTypes.oracle:
      return ["product", "category", "description", "body", "external_id"];
    case ResponderTypes.msPlanner:
      return [
        "plan_id",
        "bucket_id",
        "priority",
        "title",
        "description",
        "external_id"
      ];
    case ResponderTypes.vmware:
      return ["product", "category", "description", "body", "external_id"];
    case ResponderTypes.person:
      return ["person"];
    default:
      return [];
  }
};

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
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [teams, setTeams] = useState<any>([]);
  const {
    control,
    formState: { errors },
    getValues,
    reset,
    handleSubmit,
    setValue
  } = useForm<AddResponderFormValues>({
    defaultValues: {
      to: "",
      subject: "",
      body: "",
      category: "",
      description: "",
      project: "",
      issueType: "",
      priority: "",
      summary: "",
      product: "",
      person: ""
    }
  });

  useEffect(() => {
    const teamsApiConfig = schemaResourceTypes.find(
      (item) => item.table === "teams"
    );
    getAll(teamsApiConfig)
      .then((res) => {
        const data = res.data.map((item) => {
          return {
            icon: null,
            label: item.name,
            value: item.id,
            ...item
          };
        });
        setTeams(data);
      })
      .catch((err) => {
        setTeams([]);
      });
  }, []);

  function extractResponders(team: any) {
    const types = Object.keys(team?.spec?.responder_clients || {});
    return ResponderTypeOptions.filter((item) => {
      return types.includes(item.value);
    });
  }

  const responderTypes = useMemo(() => {
    return extractResponders(selectedTeam);
  }, [selectedTeam]);

  function deepCloneSteps() {
    return ResponderSteps.map((v) => ({ ...v }));
  }

  const onCloseModal = useCallback(() => {
    cleanupState();
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
      case ResponderTypes.email:
        return <Email control={control} errors={errors} setValue={setValue} />;
      case ResponderTypes.jira:
        return <Jira control={control} errors={errors} setValue={setValue} />;
      case ResponderTypes.serviceNow:
        return (
          <ServiceNow control={control} errors={errors} setValue={setValue} />
        );
      case ResponderTypes.ca:
        return <CA control={control} errors={errors} setValue={setValue} />;
      case ResponderTypes.awsSupport:
        return (
          <AwsSupport control={control} errors={errors} setValue={setValue} />
        );
      case ResponderTypes.awsAmsServicesRequest:
        return (
          <AwsServiceRequest
            control={control}
            errors={errors}
            setValue={setValue}
          />
        );
      case ResponderTypes.redhat:
        return <Redhat control={control} errors={errors} setValue={setValue} />;
      case ResponderTypes.oracle:
        return <Oracle control={control} errors={errors} setValue={setValue} />;
      case ResponderTypes.msPlanner:
        return (
          <MicrosoftPlanner
            control={control}
            errors={errors}
            setValue={setValue}
          />
        );
      case ResponderTypes.vmware:
        return <VMWare control={control} errors={errors} setValue={setValue} />;
      case ResponderTypes.person:
        return <Person control={control} errors={errors} setValue={setValue} />;
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
      } else {
        data[key] =
          typeof data[key] === "string" ? data[key] : data[key]?.["value"];
      }
    });
    const payload = {
      type: selectedType.type === ResponderTypes.person ? "person" : "system",
      incident_id: id,
      created_by: user?.id,
      team_id: selectedTeam.id,
      properties: {
        responderType: selectedType.value,
        ...data
      }
    };
    try {
      setLoading(true);
      const result = await saveResponder(payload);
      if (!result?.error) {
        toastSuccess("Added responder successfully");
        cleanupState();
        onSuccess();
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

  const cleanupState = () => {
    setIsOpen(false);
    setSelectedTeam(null);
    setSelectedType(null);
  };

  const getModalTitle = () => {
    if (steps[0].inProgress) {
      return `Select Team`;
    }
    if (steps[1].inProgress) {
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
        className="text-sm font-medium text-blue-600 group-hover:text-blue-500"
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
                className="block text-base font-medium text-gray-500 my-2"
              >
                Teams
              </label>
              <OptionsList
                name="responder-types"
                options={teams}
                onSelect={(e: any) => {
                  setSelectedTeam(e);
                  reset();
                  const responders = extractResponders(e);
                  if (responders.length === 1) {
                    setSelectedType(responders[0]);
                    goToStep(steps[1], steps[0]);
                    goToStep(steps[2], steps[1]);
                  } else {
                    goToStep(steps[1], steps[0]);
                  }
                }}
                value={selectedTeam}
                className={clsx(
                  "overflow-y-auto m-1",
                  teams?.length > 6 ? "h-5/6" : ""
                )}
              />
            </div>
          )}
          {steps[1].inProgress && (
            <div className="px-8 pt-4 pb-12 h-modal-body-md">
              <label
                htmlFor="responder-types"
                className="block text-base font-medium text-gray-500 my-2"
              >
                Responder Types
              </label>
              {Boolean(responderTypes.length) && (
                <OptionsList
                  name="responder-types"
                  options={responderTypes}
                  onSelect={(e: any) => {
                    setSelectedType(e);
                    goToStep(steps[2], steps[1]);
                  }}
                  value={selectedType}
                  className={clsx(
                    "overflow-y-auto m-1",
                    responderTypes?.length > 6 ? "h-5/6" : ""
                  )}
                />
              )}
              {Boolean(!responderTypes.length) && (
                <div className="text-sm text-center pt-10">
                  There were no responders configured for this team
                </div>
              )}
              <ActionButtonGroup
                className="absolute w-full bottom-0 left-0"
                previousAction={{
                  label: "Back",
                  disabled: false,
                  handler: () => goToStep(steps[0], steps[1])
                }}
              />
            </div>
          )}
          {steps[2].inProgress && (
            <div>
              <div className="px-8 py-3 min-h-modal-body-md max-h-modal-body-md mb-20 overflow-y-auto">
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
                    handler: () => {
                      if (responderTypes.length === 1) {
                        goToStep(steps[1], steps[2]);
                        goToStep(steps[0], steps[1]);
                      } else {
                        goToStep(steps[1], steps[2]);
                      }
                    }
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
                ? "inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
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
                ? "inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
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
