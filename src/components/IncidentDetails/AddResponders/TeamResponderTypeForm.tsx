import { Control, FieldErrorsImpl, UseFormSetValue } from "react-hook-form";
import { AddResponderFormValues, ResponderTypes } from "./AddResponder";
import {
  Email,
  Jira,
  ServiceNow,
  CA,
  AwsSupport,
  AwsServiceRequest,
  Redhat,
  Oracle,
  MicrosoftPlanner,
  VMWare,
  Person
} from "../ResponderTypes";

type Props = {
  selectedTeam: string;
  selectedType?: { value: string };
  control: Control<any>;
  errors: FieldErrorsImpl<AddResponderFormValues>;
  setValue: UseFormSetValue<AddResponderFormValues>;
  defaultValues?: { [key: string]: any };
  values?: { [key: string]: any };
};

export default function TeamResponderTypeForm({
  selectedTeam,
  selectedType,
  control,
  errors,
  setValue,
  defaultValues,
  values: fixedValues
}: Props) {
  switch (selectedType?.value) {
    case ResponderTypes.email:
      return (
        <Email
          control={control}
          errors={errors}
          setValue={setValue}
          defaultValues={defaultValues}
          values={fixedValues}
        />
      );
    case ResponderTypes.jira:
      return (
        <Jira
          control={control}
          errors={errors}
          setValue={setValue}
          defaultValues={defaultValues}
          values={fixedValues}
          teamId={selectedTeam}
        />
      );
    case ResponderTypes.serviceNow:
      return (
        <ServiceNow
          control={control}
          errors={errors}
          setValue={setValue}
          defaultValues={defaultValues}
          values={fixedValues}
        />
      );
    case ResponderTypes.ca:
      return (
        <CA
          control={control}
          errors={errors}
          setValue={setValue}
          defaultValues={defaultValues}
          values={fixedValues}
        />
      );
    case ResponderTypes.awsSupport:
      return (
        <AwsSupport
          control={control}
          errors={errors}
          setValue={setValue}
          defaultValues={defaultValues}
          values={fixedValues}
        />
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
      return (
        <Redhat
          control={control}
          errors={errors}
          setValue={setValue}
          defaultValues={defaultValues}
          values={fixedValues}
        />
      );
    case ResponderTypes.oracle:
      return (
        <Oracle
          control={control}
          errors={errors}
          setValue={setValue}
          defaultValues={defaultValues}
          values={fixedValues}
        />
      );
    case ResponderTypes.msPlanner:
      return (
        <MicrosoftPlanner
          control={control}
          errors={errors}
          setValue={setValue}
          defaultValues={defaultValues}
          values={fixedValues}
          teamId={selectedTeam}
        />
      );
    case ResponderTypes.vmware:
      return (
        <VMWare
          control={control}
          errors={errors}
          setValue={setValue}
          defaultValues={defaultValues}
          values={fixedValues}
        />
      );
    case ResponderTypes.person:
      return (
        <Person
          control={control}
          errors={errors}
          setValue={setValue}
          defaultValues={defaultValues}
          values={fixedValues}
        />
      );
    default:
      return null;
  }
}
