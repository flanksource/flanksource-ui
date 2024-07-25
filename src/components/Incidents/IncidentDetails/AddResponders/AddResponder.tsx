import clsx from "clsx";
import { MouseEventHandler, useState } from "react";
import { FiUser } from "react-icons/fi";
import { GrVmware } from "react-icons/gr";
import { MdEmail } from "react-icons/md";
import { SiJira } from "react-icons/si";
import { Incident } from "../../../../api/types/incident";
import { Icon } from "../../../../ui/Icons/Icon";
import AddResponderModal from "./AddResponderModal";

export type AddResponderAction = {
  label: string;
  disabled: boolean;
  handler: MouseEventHandler<HTMLButtonElement>;
  primary?: boolean;
};

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
    icon: () => <MdEmail className="inline-block h-5 w-5" />
  },
  {
    label: "Jira",
    value: ResponderTypes.jira,
    icon: () => <SiJira className="inline-block h-5 w-5" />
  },
  {
    label: "ServiceNow",
    value: ResponderTypes.serviceNow,
    icon: () => <Icon className="inline-block h-5 w-5" name="servicenow" />
  },
  {
    label: "CA",
    value: ResponderTypes.ca,
    icon: () => <Icon className="inline-block h-5 w-5" name="ca" />
  },
  {
    label: "AWS Support",
    value: ResponderTypes.awsSupport,
    icon: () => <Icon className="inline-block h-5 w-5" name="aws" />
  },
  {
    label: "AWS AMS Service Request",
    value: ResponderTypes.awsAmsServicesRequest,
    icon: () => <Icon className="inline-block h-5 w-5" name="aws" />
  },
  {
    label: "Redhat",
    value: ResponderTypes.redhat,
    icon: () => <Icon className="inline-block h-5 w-5" name="redhat" />
  },
  {
    label: "Oracle",
    value: ResponderTypes.oracle,
    icon: () => <Icon className="inline-block h-5 w-5" name="oracle_icon" />
  },
  {
    label: "Microsoft Planner",
    value: ResponderTypes.msPlanner,
    icon: () => <Icon className="inline-block" name="microsoft" />
  },
  {
    label: "VMWare",
    value: ResponderTypes.vmware,
    icon: () => <GrVmware className="inline-block h-5 w-5" />
  },
  {
    label: "Person",
    value: ResponderTypes.person,
    icon: () => <FiUser className="inline-block h-5 w-5" />
  }
];

export type AddResponderFormValues = {
  to?: string | null;
  subject?: string | null;
  body?: string | null;
  category?: string | null;
  description?: string | null;
  project?: string | null;
  issueType?: string | null;
  priority?: string | null;
  plan_id?: string | null;
  bucket_id?: string | null;
  title?: string | null;
  summary?: string | null;
  product?: string | null;
  person?: string | null;
  external_id?: string | null;
  configType?: string | null;
};

export type formPropKey = keyof AddResponderFormValues;

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

type AddResponderProps = {
  onSuccess?: () => void;
  onError?: () => void;
  incident: Incident;
} & React.HTMLProps<HTMLDivElement>;

export const AddResponder = ({
  onSuccess = () => {},
  onError = () => {},
  className,
  incident,
  ...rest
}: AddResponderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={clsx("flex flex-1 flex-col", className)} {...rest}>
      <div className="relative flex items-center">
        <div className="group flex items-center gap-2 rounded-md bg-white">
          <span className="flex items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400">
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </span>
          <span className="text-sm font-medium text-blue-600 group-hover:text-blue-500">
            <button
              className="text-sm font-medium text-blue-600 group-hover:text-blue-500"
              onClick={() => {
                setIsOpen(true);
              }}
            >
              Add Responders
            </button>
          </span>
        </div>
      </div>

      <AddResponderModal
        incident={incident}
        isOpen={isOpen}
        onCloseModal={() => setIsOpen(false)}
        onSuccess={onSuccess}
        onError={onError}
      />
    </div>
  );
};
