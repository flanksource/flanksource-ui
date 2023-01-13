import clsx from "clsx";
import { identity, pickBy } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { v4 } from "uuid";
import { load } from "js-yaml";

import { SchemaResourceI } from "../../api/schemaResources";
import { CodeEditor } from "../CodeEditor";
import { IconPicker } from "../IconPicker";
import { TextInput } from "../TextInput";
import { Icon } from "../Icon";
import { schemaResourceTypes } from "./resourceTypes";
import { TeamMembers } from "../TeamMembers/TeamMembers";
import { Tabs } from "../Canary/tabs";

type FormFields = Partial<
  Pick<
    SchemaResourceI,
    "id" | "spec" | "name" | "source" | "icon" | "namespace" | "labels"
  >
>;

type Props = FormFields & {
  onSubmit: (val: Partial<SchemaResourceI>) => Promise<void>;
  onDelete?: (id: string) => void;
  onCancel?: () => void;
  resourceName: string;
  edit?: boolean;
  isModal?: boolean;
};

export function SchemaResourceEdit({
  resourceName,
  id,
  spec,
  name,
  labels,
  namespace,
  icon,
  source,
  onSubmit,
  onDelete,
  onCancel,
  edit: startInEdit = false,
  isModal = false
}: Props) {
  const [edit, setEdit] = useState(startInEdit);
  const [disabled, setDisabled] = useState(false);
  const keyRef = useRef(v4());
  const labelsKeyRef = useRef(v4());
  const defaultValues = pickBy(
    { id, spec, name, labels, namespace, icon },
    identity
  );
  const subNav = useMemo(() => {
    const resourceType = schemaResourceTypes.find(
      (item) => item.name === resourceName
    );
    if (!resourceType) {
      return [];
    }
    return resourceType.subNav;
  }, [resourceName]);
  const [activeTab, setActiveTab] = useState(subNav[0]?.value);
  const formFields = useMemo(() => {
    const resourceType = schemaResourceTypes.find(
      (item) => item.name === resourceName
    );
    if (!resourceType) {
      return [];
    }
    return resourceType.fields;
  }, [resourceName]);

  formFields.forEach((formField) => {
    defaultValues[formField.name] =
      defaultValues[formField.name] || formField.default;
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    resetField,
    watch
  } = useForm<FormFields>({
    defaultValues
  });

  const values = getValues();

  const supportsField = (fieldName: string): boolean => {
    return (
      formFields.findIndex((field) => {
        return field.name === fieldName;
      }) !== -1
    );
  };

  useEffect(() => {
    formFields.forEach((formField) => {
      register(formField.name);
      watch(formField.name);
    });
  }, [register, formFields, watch]);

  const onEdit = () => setEdit(true);
  const doCancel = () => {
    onCancel && onCancel();
    formFields.forEach((formField) => {
      resetField(formField.name);
    });
    setEdit(false);
    keyRef.current = v4();
  };

  const doSubmit = (props: any) => {
    onSubmit(props).then(() => setEdit(false));
  };
  const doDelete = () => {
    if (!id) {
      console.error("Called delete for resource without id");
      return;
    }
    if (!onDelete) {
      console.error("onDelete called without being passed to the component.");
      return;
    }
    setDisabled(true);
    onDelete(id);
  };

  const setValueOnChange = (key: "spec" | "labels", value?: string) => {
    if (!value) {
      setValue(key, {});
      return;
    }
    try {
      const jSonObj = load(value);
      if (typeof jSonObj === "object" && jSonObj !== null) {
        setValue(key, jSonObj);
      }
    } catch (error) {
      console.error("Error parsing YAML to JSON");
    }
  };

  const onSubNavClick = (tab: any) => {
    setActiveTab(tab.value);
  };

  const hasSubNav = (nav: string) => {
    return !!subNav.find((item) => item.value === nav) && activeTab === nav;
  };

  return (
    <div className="">
      <Tabs
        className=""
        tabs={subNav}
        value={activeTab}
        onClick={onSubNavClick}
      />
      <div className="bg-white">
        {hasSubNav("spec") && (
          <form className="space-y-4" onSubmit={handleSubmit(doSubmit)}>
            <div className="px-8 pt-4">
              {!source && edit ? (
                <>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, value } }) => {
                      return (
                        <TextInput
                          label="Name"
                          id="name"
                          disabled={disabled || !!id}
                          className="w-full"
                          value={value || ""}
                          onChange={onChange}
                        />
                      );
                    }}
                  />

                  {supportsField("icon") && (
                    <div className="space-y-2">
                      <label
                        htmlFor="icon-picker"
                        className="block text-sm font-bold text-gray-700 pt-4"
                      >
                        Icon
                      </label>

                      <IconPicker
                        icon={values.icon}
                        onChange={(v) => setValue("icon", v.value)}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex justify-between">
                  <h2 className="text-dark-gray font-bold mr-3 text-xl flex items-center space-x-2">
                    {supportsField("icon") && <Icon name={icon} />}
                    <span>{name}</span>
                  </h2>
                  {!!source && (
                    <div className="px-2">
                      <a href={`${source}`}>Config source</a>
                    </div>
                  )}
                </div>
              )}
              {supportsField("namespace") && (
                <div className="mt-4">
                  <Controller
                    control={control}
                    name="namespace"
                    render={({ field: { onChange, value } }) => {
                      return (
                        <TextInput
                          label="Namespace"
                          id="namespace"
                          disabled={disabled || !!id}
                          className="w-full"
                          value={value || ""}
                          onChange={onChange}
                        />
                      );
                    }}
                  />
                </div>
              )}
              {supportsField("labels") && (
                <div className="py-4">
                  <Controller
                    control={control}
                    name="labels"
                    render={({ field: { onChange, value } }) => {
                      return (
                        <div className="h-[100px]">
                          <label className="block text-sm font-bold text-gray-700">
                            Labels
                          </label>
                          <CodeEditor
                            key={labelsKeyRef.current}
                            readOnly={!!source || disabled || !edit}
                            value={
                              typeof values.labels === "object"
                                ? JSON.stringify(values.labels, null, 2)
                                : null
                            }
                            onChange={(val) => {
                              setValueOnChange("labels", val);
                            }}
                          />
                        </div>
                      );
                    }}
                  />
                </div>
              )}
            </div>
            <div className="px-8 space-y-2">
              <label
                htmlFor="icon-picker"
                className="block text-sm font-bold text-gray-700"
              >
                Spec
              </label>

              <div className="h-[min(850px,calc(100vh-500px))]">
                <CodeEditor
                  key={keyRef.current}
                  readOnly={!!source || disabled || !edit}
                  value={typeof values.spec === "string" ? values.spec : null}
                  onChange={(val) => {
                    setValueOnChange("spec", val);
                  }}
                />
              </div>
            </div>
            {!source && (
              <div
                className={clsx(
                  "flex justify-between px-10 rounded-b py-4 space-x-2",
                  {
                    "bg-gray-100": isModal
                  }
                )}
              >
                {!!id && (
                  <button
                    className="inline-flex items-center justify-center border-none shadow-sm font-medium rounded-md text-red-500 bg-red-100 hover:bg-red-200 focus:ring-offset-white focus:ring-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 text-sm leading-5"
                    disabled={disabled}
                    onClick={doDelete}
                  >
                    Delete
                  </button>
                )}

                {edit ? (
                  <div className="w-full flex justify-between">
                    <button
                      className="btn-secondary-base btn-secondary"
                      disabled={disabled}
                      onClick={doCancel}
                    >
                      Cancel
                    </button>

                    <button
                      disabled={disabled}
                      className="btn-primary"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  !!id && (
                    <button
                      className="btn-primary"
                      disabled={disabled}
                      onClick={onEdit}
                    >
                      Edit
                    </button>
                  )
                )}
              </div>
            )}
          </form>
        )}
        {hasSubNav("manageTeam") && <TeamMembers teamId={id!} />}
      </div>
    </div>
  );
}
