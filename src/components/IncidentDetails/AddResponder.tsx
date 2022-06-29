import { useState, useMemo, useCallback } from "react";
import { components } from "react-select";
import { SiJira } from "react-icons/si";
import { MdEmail } from "react-icons/md";
import { GrVmware } from "react-icons/gr";
import { useForm } from "react-hook-form";
import { FiUser } from "react-icons/fi";
import clsx from "clsx";
import { Modal } from "../Modal";
import { Select } from "../Select";
import { Icon } from "../Icon";

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

const RESPONDER_TYPE = [
  { type: "Email", icon: MdEmail },
  { type: "Jira", icon: SiJira },
  { type: "ServiceNow", icon: "service-now" },
  { type: "CA", icon: "ca" },
  { type: "AWS Support", icon: "aws" },
  { type: "AWS AMS Service Request", icon: "aws" },
  { type: "Redhat", icon: "redhat" },
  { type: "Oracle", icon: "oracle_icon" },
  { type: "Microsoft", icon: "microsoft" },
  { type: "VMWare", icon: GrVmware },
  { type: "Person", icon: FiUser }
];

const ResponderOptions = ({ children, ...props }) => {
  const { icon: IconName } = props.data;
  return (
    <components.Option {...props}>
      <div className="flex flex-row gap-1.5 text-sm items-center">
        {IconName &&
          (typeof IconName === "string" ? (
            <Icon name={IconName} />
          ) : (
            <IconName />
          ))}
        {children}
      </div>
    </components.Option>
  );
};

export const AddResponder = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset
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

  const options = useMemo(
    () =>
      RESPONDER_TYPE.map((item) => ({
        ...item,
        value: item.type,
        label: item.type
      })),
    []
  );

  const onCloseModal = useCallback(() => {
    setIsOpen(false);
    setSelectedType(null);
  }, []);

  const onChangeResponderType = useCallback((responderType) => {
    setSelectedType(responderType);
    reset();
  }, []);

  const getResponderTypeForm = () => {
    switch (selectedType?.type) {
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

  const onSubmit = (data, e) => {
    console.log(data, e);
  };

  const onError = (errors, e) => {
    console.log(errors, e);
  };

  return (
    <div className="flex flex-1 justify-end">
      <button
        type="button"
        className="btn-primary"
        onClick={() => setIsOpen(true)}
      >
        Add Responder
      </button>
      <Modal
        title="Add Responder"
        onClose={onCloseModal}
        open={isOpen}
        size="small"
      >
        <div className="my-6 min-h-50vh">
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <Select
              name="responderType"
              options={options}
              onChange={onChangeResponderType}
              placeholder="Responder type..."
              className="mb-3"
              components={{ Option: ResponderOptions }}
            />
            <div className="my-2">{getResponderTypeForm()}</div>
            <button
              disabled={!selectedType}
              type="submit"
              className={clsx("w-full", {
                "btn-disabled": !selectedType,
                "btn-primary": selectedType
              })}
            >
              Add Responder
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};
