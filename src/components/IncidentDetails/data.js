// Temporary mock, in the future you need to replace it with an array of real respondents received from the apis
import {
  HiOutlineChevronDoubleUp,
  HiOutlineChevronDown,
  HiOutlineChevronUp
} from "react-icons/hi";
import React from "react";
import { IncidentPriority } from "../../constants/incident-priority";

export const personRespondents = [
  {
    label: "Lindsay Walton",
    value: "b4d63f9d-e9f2-44eb-82da-a06fe98a8937",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80"
  },
  {
    label: "Eduardo Benz",
    value: "0dee8202-9acd-4c00-8e56-4d779ed2ab01",
    avatar:
      "https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
  },
  {
    label: "Test Person",
    value: "0b984b49-436e-44ba-8a08-c8302d5c3a6d",
    avatar:
      "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
];
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
