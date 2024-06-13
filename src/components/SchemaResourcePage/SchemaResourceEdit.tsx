import { SchemaResourceI } from "@flanksource-ui/api/schemaResources";
import AutoCompleteDropdown from "@flanksource-ui/ui/AutoCompleteDropdown/AutoCompleteDropdown";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import clsx from "clsx";
import { identity, pickBy } from "lodash";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { v4 } from "uuid";
import YAML from "yaml";
import { TextInput } from "../../ui/FormControls/TextInput";
import { Head } from "../../ui/Head";
import { Icon } from "../../ui/Icons/Icon";
import { IconPicker } from "../../ui/Icons/IconPicker";
import { Tab, Tabs } from "../../ui/Tabs/Tabs";
import EditTopologyResource from "../Integrations/Topology/EditTopologyResource";
import CanEditResource from "../Settings/CanEditResource";
import ConfigScrapperSpecEditor from "../SpecEditor/ConfigScrapperSpecEditor";
import HealthSpecEditor from "../SpecEditor/HealthSpecEditor";
import { TeamMembers } from "../TeamMembers/TeamMembers";
import DeleteResource from "./Delete/DeleteResource";
import {
  SchemaResourceJobsTab,
  resourceTypeMap
} from "./SchemaResourceEditJobsTab";
import { SchemaResourceType, schemaResourceTypes } from "./resourceTypes";

const CodeEditor = dynamic(
  () => import("@flanksource-ui/ui/Code/CodeEditor").then((m) => m.CodeEditor),
  { ssr: false }
);

type FormFields = Partial<
  Pick<
    SchemaResourceI,
    | "id"
    | "spec"
    | "name"
    | "source"
    | "icon"
    | "namespace"
    | "labels"
    | "schedule"
    | "agent_id"
    | "agent"
  >
>;

type Props = FormFields & {
  onSubmit: (val: Partial<SchemaResourceI>) => Promise<void>;
  onCancel?: () => void;
  edit?: boolean;
  isModal?: boolean;
  resourceInfo: SchemaResourceType;
};

export function SchemaResourceEdit({
  id,
  spec,
  name,
  labels,
  namespace,
  icon,
  source,
  onSubmit,
  onCancel,
  isModal = false,
  schedule,
  agent_id: agentId,
  agent,
  resourceInfo
}: Props) {
  //FIXME
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [disabled, setDisabled] = useState(false);
  const keyRef = useRef(v4());
  const labelsKeyRef = useRef(v4());
  const defaultValues = pickBy(
    {
      id,
      spec,
      name,
      labels,
      namespace,
      icon,
      schedule,
      source
    },
    identity
  );

  const resourceName = resourceInfo.name;

  const subNav = useMemo(() => {
    const resourceType = schemaResourceTypes.find(
      (item) => item.name === resourceName
    );
    if (!resourceType) {
      return [];
    }
    return resourceType.subNav;
  }, [resourceName]);

  const table = useMemo(() => {
    const resourceType = schemaResourceTypes.find(
      (item) => item.name === resourceName
    );
    if (!resourceType) {
      return "";
    }
    return resourceType.table;
  }, [resourceName]);

  const [activeTab, setActiveTab] = useState<string>(subNav[0]?.value);

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

  const { control, register, handleSubmit, setValue, getValues, watch } =
    useForm<FormFields>({
      defaultValues: {
        ...defaultValues
      }
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

  const doSubmit = (props: any) => {
    onSubmit(props);
  };

  const setCodeEditorValueOnChange = useCallback(
    (key: "spec" | "labels", value?: string) => {
      if (!value) {
        setValue(key, {});
        return;
      }
      try {
        const jSonObj = YAML.parse(value);
        if (typeof jSonObj === "object" && jSonObj !== null) {
          setValue(key, jSonObj);
        }
      } catch (error) {
        console.error("Error parsing YAML to Object");
      }
    },
    [setValue]
  );

  const onSubNavClick = (tab: string) => {
    setActiveTab(tab);
  };

  const hasSubNav = useCallback(
    (nav: string) => {
      return !!subNav.find((item) => item.value === nav) && activeTab === nav;
    },
    [subNav, activeTab]
  );

  const specValueToString = useCallback((spec: unknown) => {
    if (typeof spec === "string") {
      return spec;
    }
    if (typeof spec === "object") {
      return YAML.stringify(spec);
    }
    return undefined;
  }, []);

  const jsonSchemaFilePrefix = useMemo(() => {
    if (table === "config_scrapers") {
      return "config_scraper.spec.schema.json";
    }
    if (table === "topologies") {
      return "topology.spec.schema.json";
    }
    if (table === "canaries") {
      return "canary.spec.schema.json";
    }
    return undefined;
  }, [table]);

  return (
    <>
      <Head prefix={`${name} - ${resourceName}`} />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Tabs activeTab={activeTab} onSelectTab={(tab) => onSubNavClick(tab)}>
          {subNav.map((nav) => {
            return (
              <Tab
                className="flex flex-col flex-1 overflow-y-auto"
                key={nav.label}
                label={nav.label}
                value={nav.value}
              >
                <div className="flex flex-col flex-1 bg-white overflow-y-auto">
                  {hasSubNav("spec") &&
                    (table === "canaries" && !source ? (
                      <div className="flex-col flex flex-1 overflow-y-auto">
                        <HealthSpecEditor
                          onSubmit={(val) => doSubmit(val)}
                          resourceInfo={resourceInfo}
                          resourceValue={defaultValues}
                        />
                      </div>
                    ) : table === "config_scrapers" ? (
                      <div className="flex-col flex flex-1 overflow-y-auto">
                        <ConfigScrapperSpecEditor
                          onSubmit={(val) => doSubmit(val)}
                          resourceValue={defaultValues}
                          onDeleted={() => {
                            if (onCancel) {
                              onCancel();
                            }
                          }}
                        />
                      </div>
                    ) : table === "topologies" ? (
                      <div className="flex-col flex flex-1 overflow-y-auto">
                        <EditTopologyResource
                          topologyResource={
                            defaultValues as unknown as SchemaResourceI
                          }
                          onSuccess={() => onCancel?.()}
                          onCancel={onCancel}
                        />
                      </div>
                    ) : (
                      <form
                        className="flex flex-col flex-1 overflow-y-auto"
                        onSubmit={handleSubmit(doSubmit)}
                      >
                        <div className="flex flex-col flex-1 overflow-y-auto gap-4 pb-4">
                          <div className="px-8 pt-4 flex flex-col">
                            {!source ? (
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
                                      className="form-label pt-4"
                                    >
                                      Icon
                                    </label>

                                    <IconPicker
                                      icon={values.icon}
                                      onChange={(v) =>
                                        setValue("icon", v.value)
                                      }
                                    />
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="flex justify-between">
                                <h2 className="text-dark-gray font-bold mr-3 text-xl flex items-center space-x-2">
                                  {supportsField("icon") && (
                                    <Icon name={icon} />
                                  )}
                                  <span>{name}</span>
                                </h2>
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
                                        <label className="form-label">
                                          Labels
                                        </label>
                                        <CodeEditor
                                          key={labelsKeyRef.current}
                                          readOnly={!!source || disabled}
                                          value={
                                            typeof values.labels === "object"
                                              ? JSON.stringify(
                                                  values.labels,
                                                  null,
                                                  2
                                                )
                                              : undefined
                                          }
                                          onChange={(val) => {
                                            setCodeEditorValueOnChange(
                                              "labels",
                                              val
                                            );
                                          }}
                                          language="json"
                                        />
                                      </div>
                                    );
                                  }}
                                />
                              </div>
                            )}

                            {supportsField("schedule") && (
                              <div className="py-4">
                                <Controller
                                  control={control}
                                  name="schedule"
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <div className="space-y-2">
                                        <label className="form-label">
                                          Schedule
                                        </label>
                                        <AutoCompleteDropdown
                                          onChange={onChange}
                                          value={value}
                                          isDisabled={!!source || disabled}
                                          options={[
                                            {
                                              label: "@every 30s",
                                              value: "@every 30s"
                                            },
                                            {
                                              label: "@every 1m",
                                              value: "@every 1m"
                                            },
                                            {
                                              label: "@every 5m",
                                              value: "@every 5m"
                                            },
                                            {
                                              label: "@every 30m",
                                              value: "@every 30m"
                                            },
                                            {
                                              label: "@hourly",
                                              value: "@hourly"
                                            },
                                            {
                                              label: "@every 6h",
                                              value: "@every 6h"
                                            },
                                            {
                                              label: "@daily",
                                              value: "@daily"
                                            },
                                            {
                                              label: "@weekly",
                                              value: "@weekly"
                                            }
                                          ]}
                                        />
                                      </div>
                                    );
                                  }}
                                />
                              </div>
                            )}
                          </div>
                          <div className="px-8 space-y-2">
                            <label htmlFor="icon-picker" className="form-label">
                              Spec
                            </label>
                            <div className="flex flex-col h-[min(500px,calc(100vh-500px))]">
                              <CodeEditor
                                key={keyRef.current}
                                readOnly={!!source || disabled}
                                value={specValueToString(values.spec)}
                                onChange={(val) => {
                                  setCodeEditorValueOnChange("spec", val);
                                }}
                                language="yaml"
                                schemaFileName={jsonSchemaFilePrefix}
                                enableSpecUnwrap
                              />
                            </div>
                          </div>
                        </div>
                        <CanEditResource
                          resourceType={table as keyof typeof resourceTypeMap}
                          agentName={agent?.name}
                          name={name!}
                          source={source}
                          namespace={namespace!}
                          id={id!}
                          agentId={agentId}
                        >
                          <div
                            className={clsx(
                              "flex justify-end px-10 rounded-b py-4 space-x-2",
                              {
                                "bg-gray-100": isModal
                              }
                            )}
                          >
                            {!!id && (
                              <DeleteResource
                                resourceId={id}
                                resourceInfo={resourceInfo}
                                onDeleted={() => {
                                  if (onCancel) {
                                    onCancel();
                                  }
                                }}
                              />
                            )}

                            <Button
                              type="submit"
                              text={!!id ? "Update" : "Save"}
                              className="btn-primary"
                            />
                          </div>
                        </CanEditResource>
                      </form>
                    ))}
                  {hasSubNav("manageTeam") && <TeamMembers teamId={id!} />}
                  {hasSubNav("jobHistory") && (
                    <SchemaResourceJobsTab
                      resourceId={id!}
                      tableName={table as keyof typeof resourceTypeMap}
                    />
                  )}
                </div>
              </Tab>
            );
          })}
        </Tabs>
      </div>
    </>
  );
}
