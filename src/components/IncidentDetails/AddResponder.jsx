import React, { useState, useMemo, useCallback } from "react";
import { components } from "react-select";
import { SiJira } from "react-icons/si";
import { MdEmail } from "react-icons/md";
import { GrVmware } from "react-icons/gr";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Modal } from "../Modal";
import { Select } from "../Select";
import { ConfigItem } from "../ConfigItem/config-item";
import { Icon } from "../Icon";
import { TextInput } from "../TextInput";

const RESPONDER_TYPE = [
  { type: "Email", icon: MdEmail, customInput: true },
  { type: "Jira", icon: SiJira },
  { type: "ServiceNow", icon: "SN" },
  { type: "CA", icon: "ca" },
  { type: "AWS Support", icon: "aws" },
  { type: "AWS AMS Service Request", icon: "aws" },
  { type: "Redhat", icon: "redhat" },
  { type: "Oracle", icon: "oracle_icon" },
  { type: "Microsoft", icon: "microsoft" },
  { type: "VMWare", icon: GrVmware }
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

export const AddResponder = ({ onAddResponder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [responder, setResponder] = useState(null);

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
    setResponder(null);
  }, []);

  const onChangeResponderType = useCallback((responderType) => {
    setSelectedType(responderType);
    setResponder(null);
  }, []);

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
        <div className="my-6">
          <Select
            name="responderType"
            options={options}
            onChange={onChangeResponderType}
            placeholder="Responder type..."
            className="mb-3"
            components={{ Option: ResponderOptions }}
          />
          {selectedType?.customInput ? (
            <TextInput
              id="responder"
              type="email"
              placeholder="example@company.com"
              className="w-full"
              value={responder}
              onChange={(e) => setResponder(e.target.value)}
            />
          ) : (
            <ConfigItem
              onSelect={setResponder}
              type={selectedType?.type}
              placeholder="Select responder..."
              isDisabled={!selectedType}
            />
          )}
        </div>
        <button
          disabled={!(responder && selectedType)}
          type="button"
          className={clsx("w-full", {
            "btn-disabled": !(responder && selectedType),
            "btn-primary": responder && selectedType
          })}
          onClick={() => onAddResponder(responder, selectedType)}
        >
          Add Responder
        </button>
      </Modal>
    </div>
  );
};

AddResponder.propTypes = {
  onAddResponder: PropTypes.func.isRequired
};
