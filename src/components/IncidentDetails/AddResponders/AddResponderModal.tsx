import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { isEqual, template } from "lodash";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { IconType } from "react-icons";
import { Incident } from "../../../api/services/incident";
import { Responder, saveResponder } from "../../../api/services/responder";
import { Team } from "../../../api/services/teams";
import { User } from "../../../api/services/users";
import { useUser } from "../../../context";
import { incidentStatusItems, typeItems } from "../../Incidents/data";
import { Modal } from "../../Modal";
import { OptionsList } from "../../OptionsList";
import { toastError, toastSuccess } from "../../Toast/toast";
import { ActionButtonGroup } from "./ActionButtonGroup";
import {
  AddResponderFormValues,
  ResponderTypeOptions,
  ResponderTypes
} from "./AddResponder";
import SelectPeopleResponderDropdown from "./SelectPeopleResponderDropdown";
import SelectTeamResponderDropdown from "./SelectTeamResponderDropdown";
import TeamResponderTypeForm from "./TeamResponderTypeForm";
import { Events, sendAnalyticEvent } from "../../../services/analytics";

export type SelectedResponderType = {
  value: string;
  label: string;
  icon: IconType;
};

type TeamRespondersState = {
  currentStep: "Select Responder" | "Responder Type" | "Save Team Responder";
  modalTitle?: string;
  responderType?: SelectedResponderType;
};

type TeamResponderActions = {
  action:
    | "Selected Responder"
    | "Selected Responder Type"
    | "Save Responder"
    | "Save Team Responder"
    | "Previous"
    | "reset";
  payload?: {
    teamResponder?: Team;
    personResponder?: User;
    teamResponderType?: SelectedResponderType;
  };
};

function teamRespondersStepsReducer(
  state: TeamRespondersState,
  action: TeamResponderActions
): TeamRespondersState {
  switch (action.action) {
    case "Selected Responder":
      if (action.payload?.teamResponder) {
        // move to Responder Type
        return {
          ...state,
          currentStep: "Responder Type",
          modalTitle: "Select Responder Type"
        };
      }
      return {
        ...state,
        currentStep: "Select Responder"
      };
    case "Selected Responder Type":
      return {
        ...state,
        currentStep: "Save Team Responder"
      };
    case "Save Responder":
      return {
        ...state,
        currentStep: "Select Responder"
      };
    case "Save Team Responder":
      return {
        ...state,
        currentStep: "Save Team Responder",
        responderType: action.payload?.teamResponderType
      };
    case "Previous":
      if (state.currentStep === "Responder Type") {
        return {
          ...state,
          currentStep: "Select Responder",
          modalTitle: "Select Responder"
        };
      } else if (state.currentStep === "Save Team Responder") {
        return {
          ...state,
          currentStep: "Responder Type",
          modalTitle: "Select Responder Type"
        };
      } else {
        return {
          ...state,
          currentStep: "Select Responder",
          modalTitle: "Select Responder"
        };
      }

    case "reset":
      return {
        currentStep: "Select Responder"
      };
    default:
      return {
        ...state,
        currentStep: "Select Responder",
        modalTitle: "Select Responder"
      };
  }
}

type Props = {
  onSuccess?: () => void;
  onError?: () => void;
  incident: Incident;
  onCloseModal?: () => void;
  isOpen?: boolean;
};

export default function AddResponderModal({
  onSuccess = () => {},
  onError = () => {},
  isOpen = false,
  onCloseModal = () => {},
  incident
}: Props) {
  const [state, dispatch] = useReducer(teamRespondersStepsReducer, {
    currentStep: "Select Responder",
    modalTitle: "Select Responder"
  });
  const [selectedType, setSelectedType] = useState<
    SelectedResponderType | undefined
  >();

  const [team, setTeam] = useState<Team>();
  const [person, setPerson] = useState<User>();

  const [fixedValues, setFixedValues] = useState<{ [key: string]: any }>();
  const [defaultValues, setDefaultValues] = useState<{ [key: string]: any }>();
  const {
    control,
    formState: { errors },
    watch,
    setValue,
    getValues
  } = useForm<AddResponderFormValues>({
    defaultValues: {
      to: null,
      subject: null,
      body: null,
      category: null,
      description: null,
      project: null,
      issueType: null,
      priority: null,
      summary: null,
      product: null,
      person: null
    }
  });
  const watchAllFields = watch();
  const incidentDetails = useMemo(() => {
    return {
      ...incident,
      status:
        incident.status === incidentStatusItems.open.value
          ? incidentStatusItems.open.description
          : incidentStatusItems.closed.description,
      type: typeItems[incident.type as keyof typeof typeItems]?.description
    };
  }, [incident]);

  const { user } = useUser();

  const closeModal = () => {
    setTeam(undefined);
    setPerson(undefined);
    dispatch({ action: "reset" });
    onCloseModal();
  };

  const { mutate: addResponder, isLoading: loading } = useMutation({
    mutationFn: (
      responder: Omit<Responder, "id" | "updated_at" | "created_at">
    ) => saveResponder(responder),
    onSuccess: (_) => {
      sendAnalyticEvent(Events.AddedResponderToIncident);
      toastSuccess("Responder added successfully");
      onSuccess();
      closeModal();
    },
    onError: (error: any) => {
      toastError(error);
      onError();
      closeModal();
    }
  });

  function replacePlaceholders(
    templateString: string,
    context: object
  ): string {
    try {
      return template(templateString)(context);
    } catch (ex) {
      return templateString;
    }
  }

  useEffect(() => {
    const responderType = selectedType?.value!;
    const responderConfig = team?.spec?.responder_clients?.[responderType];
    const values = { ...(responderConfig?.values || {}) };
    const defaults = { ...(responderConfig?.defaults || {}) };
    const data: { [key: string]: any } = {};
    Object.keys(watchAllFields).forEach((prop: string) => {
      const value = watchAllFields[prop as keyof typeof watchAllFields];
      data[prop] = typeof value === "object" ? (value as any)?.name : value;
    });
    data.incident = {
      ...incidentDetails
    };
    if (defaults) {
      const newDefaultValues: { [key: string]: any } = {};
      Object.keys(defaults || {}).forEach((key) => {
        newDefaultValues[key] = replacePlaceholders(defaults[key], data);
      });
      if (!isEqual(defaultValues, newDefaultValues)) {
        setDefaultValues(newDefaultValues);
      }
    }
    if (!isEqual(values, fixedValues)) {
      setFixedValues(values);
    }
  }, [
    watchAllFields,
    team,
    selectedType,
    team?.spec?.responder_clients,
    incidentDetails,
    fixedValues,
    defaultValues
  ]);

  function extractResponders(team?: Team) {
    const types = Object.keys(team?.spec?.responder_clients || {});
    return ResponderTypeOptions.filter((item) => {
      return types.includes(item.value);
    });
  }

  const responderTypes = useMemo(() => {
    return extractResponders(team);
  }, [team]);

  const onSubmit = useCallback(async () => {
    const data = getValues();
    Object.keys(data).forEach((key) => {
      if (!data[key as keyof AddResponderFormValues]) {
        delete data[key as keyof AddResponderFormValues];
      } else {
        data[key as keyof AddResponderFormValues] =
          typeof data[key as keyof AddResponderFormValues] === "string"
            ? data[key as keyof AddResponderFormValues]
            : (data[key as keyof AddResponderFormValues] as any)?.["value"];
      }
    });

    const payload = {
      type:
        (state.responderType as unknown as string) === ResponderTypes.person
          ? "person"
          : "system",
      incident_id: incident.id,
      created_by: user?.id,
      team_id: team?.id,
      person_id: person?.id,
      properties: {
        responderType: selectedType,
        ...data
      }
    };
    addResponder(payload);
  }, [
    addResponder,
    getValues,
    incident.id,
    person?.id,
    selectedType,
    state.responderType,
    team?.id,
    user?.id
  ]);

  const modalTitle = useMemo(() => {
    if (state.modalTitle) {
      return state.modalTitle;
    }
    return (
      <div className="flex flex-row gap-2 w-full">
        {selectedType?.icon && <selectedType.icon className="inline-block" />}{" "}
        <span>{selectedType?.label} Details</span>
      </div>
    );
  }, [selectedType, state.modalTitle]);

  return (
    <Modal
      title={modalTitle}
      onClose={() => closeModal()}
      open={isOpen}
      bodyClass=""
      containerClassName=""
    >
      <>
        {state.currentStep === "Select Responder" && (
          <>
            <div className="p-4 h-auto">
              <div className="flex flex-col gap-4">
                <div className="flex flex-row flex-1 gap-2 h">
                  <SelectTeamResponderDropdown
                    value={team?.id}
                    onChange={(team) => {
                      setTeam(team);
                      setPerson(undefined);
                    }}
                  />
                </div>
                <div className="flex w-auto flex-col gap-2 items-center justify-center text-sm">
                  OR
                </div>
                <div className="flex flex-1 flex-col gap-2 h">
                  <SelectPeopleResponderDropdown
                    value={person?.id}
                    onChange={(person) => {
                      setPerson(person);
                      setTeam(undefined);
                    }}
                  />
                </div>
              </div>
            </div>
            {/* when responder is a person, we just save */}
            {person ? (
              <ActionButtonGroup
                className="w-full bottom-0 left-0"
                nextAction={{
                  label: !loading ? "Add" : "Adding ...",
                  disabled: !person || loading,
                  handler: () => onSubmit(),
                  primary: true
                }}
              />
            ) : (
              <ActionButtonGroup
                className="w-full bottom-0 left-0"
                nextAction={{
                  label: "Next",
                  disabled: !team,
                  handler: () => {
                    dispatch({
                      action: "Selected Responder",
                      payload: {
                        teamResponder: team
                      }
                    });
                  },
                  primary: true
                }}
              />
            )}
          </>
        )}
        {state.currentStep === "Responder Type" && (
          <div className="px-8 pt-4 pb-12 h-modal-body-md">
            <label
              htmlFor="responder-types"
              className="block text-base font-medium text-gray-500 my-2"
            >
              Responder Types
            </label>
            {responderTypes.length > 0 ? (
              <OptionsList
                name="responder-types"
                options={responderTypes}
                onSelect={(e: any) => {
                  setSelectedType(e);
                  dispatch({
                    action: "Save Team Responder",
                    payload: {
                      teamResponderType: e
                    }
                  });
                }}
                value={selectedType as any}
                className={clsx(
                  "overflow-y-auto m-1",
                  responderTypes?.length > 6 ? "h-5/6" : ""
                )}
              />
            ) : (
              <div className="text-sm text-center pt-10">
                There were no responders configured for this team
              </div>
            )}
          </div>
        )}
        {state.currentStep === "Save Team Responder" && (
          <div>
            <div className="px-8 py-3 min-h-modal-body-md max-h-modal-body-md mb-20 overflow-y-auto">
              <TeamResponderTypeForm
                selectedTeam={team?.id!}
                selectedType={state.responderType}
                control={control}
                errors={errors}
                setValue={setValue}
                defaultValues={defaultValues}
                values={fixedValues}
              />
              <ActionButtonGroup
                className="absolute w-full bottom-0 left-0"
                nextAction={{
                  label: !loading ? "Save" : "Saving...",
                  disabled: !selectedType || loading,
                  handler: () => onSubmit(),
                  primary: true
                }}
                previousAction={{
                  label: "Back",
                  disabled: !selectedType || loading,
                  handler: () => {
                    dispatch({
                      action: "Selected Responder",
                      payload: {
                        personResponder: undefined,
                        teamResponder: undefined
                      }
                    });
                  }
                }}
              />
            </div>
          </div>
        )}
      </>
    </Modal>
  );
}
