import {
  HiOutlineChevronDoubleUp,
  HiOutlineChevronDown,
  HiOutlineChevronUp
} from "react-icons/hi";
import React from "react";
import { IncidentPriority } from "../../constants/incident-priority";

export const priorities = [
  {
    label: "Low",
    value: IncidentPriority.Low,
    icon: function IconToProps(props) {
      return <HiOutlineChevronDown color="green" {...props} />;
    }
  },
  {
    label: "Medium",
    value: IncidentPriority.Medium,
    icon: function IconToProps(props) {
      return <HiOutlineChevronUp color="red" {...props} />;
    }
  },
  {
    label: "High",
    value: IncidentPriority.High,
    icon: function IconToProps(props) {
      return <HiOutlineChevronDoubleUp color="red" {...props} />;
    }
  }
];
