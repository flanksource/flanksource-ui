import { fetchPermissionSubjects } from "@flanksource-ui/api/services/permissions";
import { getAllPlaybookNames } from "@flanksource-ui/api/services/playbooks";
import {
  reviewSubjectAccess,
  SubjectAccessReviewAction,
  SubjectAccessReviewResource
} from "@flanksource-ui/api/services/rbac";
import { getErrorMessage } from "@flanksource-ui/api/types/error";
import { getAllViews } from "@flanksource-ui/api/services/views";
import { Badge } from "@flanksource-ui/components/ui/badge";
import { Button } from "@flanksource-ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@flanksource-ui/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@flanksource-ui/components/ui/select";
import SubjectAvatar from "@flanksource-ui/components/Permissions/SubjectAvatar";
import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";

export type PermissionAccessCheckResourceType = "playbook" | "view";

export type PermissionAccessCheckResource = {
  type: PermissionAccessCheckResourceType;
  id: string;
  name?: string;
};

export type PermissionAccessCheckConfig = {
  actions: SubjectAccessReviewAction[];
  title?: string;
  description?: string;
  resource?: PermissionAccessCheckResource;
  lockedResource?: PermissionAccessCheckResource;
  allowedResourceTypes?: PermissionAccessCheckResourceType[];
  hideResourceForActions?: SubjectAccessReviewAction[];
  resourceOverrideByAction?: Partial<
    Record<SubjectAccessReviewAction, SubjectAccessReviewResource>
  >;
};

type PermissionAccessCheckModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: PermissionAccessCheckConfig;
};

type PermissionAccessCheckFormValues = {
  resourceType: PermissionAccessCheckResourceType;
  resourceId: string;
  subjectId: string;
  action: SubjectAccessReviewAction | "";
};

type PermissionAccessCheckFormProps = {
  config: PermissionAccessCheckConfig;
  isActive?: boolean;
  onCancel?: () => void;
};

type PermissionAccessResourceSelectorProps = {
  resourceType: PermissionAccessCheckResourceType;
  resourceId: string;
  setFieldValue: (field: string, value: unknown) => void;
  clearResult: () => void;
  lockedResource?: PermissionAccessCheckResource;
  allowedResourceTypes: PermissionAccessCheckResourceType[];
  isActive: boolean;
};

function PermissionAccessResourceSelector({
  resourceType,
  resourceId,
  setFieldValue,
  clearResult,
  lockedResource,
  allowedResourceTypes,
  isActive
}: PermissionAccessResourceSelectorProps) {
  const shouldLoadPlaybooks = allowedResourceTypes.includes("playbook");
  const shouldLoadViews = allowedResourceTypes.includes("view");

  const { data: playbooks = [] } = useQuery({
    queryKey: ["permission-access-check", "playbooks"],
    queryFn: getAllPlaybookNames,
    enabled: isActive && shouldLoadPlaybooks
  });

  const { data: viewsResponse } = useQuery({
    queryKey: ["permission-access-check", "views"],
    queryFn: async () => getAllViews([{ id: "name", desc: false }], 0, 1000),
    enabled: isActive && shouldLoadViews
  });

  const sortedPlaybooks = useMemo(
    () =>
      [...playbooks].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      ),
    [playbooks]
  );

  const groupedPlaybooks = useMemo(() => {
    const grouped = new Map<string, typeof sortedPlaybooks>();

    for (const playbook of sortedPlaybooks) {
      const category = playbook.category?.trim() || "Other";
      const list = grouped.get(category) ?? [];
      list.push(playbook);
      grouped.set(category, list);
    }

    return Array.from(grouped.entries()).sort(([a], [b]) => {
      if (a === "Other") {
        return 1;
      }
      if (b === "Other") {
        return -1;
      }
      return a.localeCompare(b, undefined, { sensitivity: "base" });
    });
  }, [sortedPlaybooks]);

  const sortedViews = useMemo(() => {
    const views = viewsResponse?.data ?? [];

    return [...views].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );
  }, [viewsResponse?.data]);

  useEffect(() => {
    if (lockedResource) {
      return;
    }

    if (resourceType === "playbook") {
      if (!resourceId && sortedPlaybooks.length > 0) {
        setFieldValue("resourceId", sortedPlaybooks[0].id);
        clearResult();
      }
      return;
    }

    if (!resourceId && sortedViews.length > 0) {
      setFieldValue("resourceId", sortedViews[0].id);
      clearResult();
    }
  }, [
    clearResult,
    lockedResource,
    resourceId,
    resourceType,
    setFieldValue,
    sortedPlaybooks,
    sortedViews
  ]);

  const selectedPlaybook = useMemo(
    () => sortedPlaybooks.find((item) => item.id === resourceId),
    [resourceId, sortedPlaybooks]
  );

  const selectedView = useMemo(
    () => sortedViews.find((item) => item.id === resourceId),
    [resourceId, sortedViews]
  );

  const selectedName =
    resourceType === "playbook"
      ? (selectedPlaybook?.name ?? lockedResource?.name)
      : (selectedView?.name ?? lockedResource?.name);
  const selectedNamespace =
    resourceType === "playbook"
      ? selectedPlaybook?.namespace
      : selectedView?.namespace;

  return (
    <div className="space-y-4">
      {allowedResourceTypes.length > 1 ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">Resource Type</p>
          <Switch<PermissionAccessCheckResourceType>
            options={allowedResourceTypes}
            value={resourceType}
            onChange={(value) => {
              if (lockedResource) {
                return;
              }

              setFieldValue("resourceType", value);
              setFieldValue("resourceId", "");
              clearResult();
            }}
            className="w-full"
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <p className="text-sm font-medium">Resource</p>
        <Select
          value={resourceId || undefined}
          onValueChange={(value) => {
            if (lockedResource) {
              return;
            }

            setFieldValue("resourceId", value);
            clearResult();
          }}
          disabled={!!lockedResource}
        >
          <SelectTrigger>
            {selectedName ? (
              <div className="flex w-full items-center gap-2">
                <span className="truncate">{selectedName}</span>
                {selectedNamespace ? (
                  <Badge
                    variant="secondary"
                    className="ml-auto px-1.5 py-0 text-[10px] font-medium"
                  >
                    {selectedNamespace}
                  </Badge>
                ) : null}
              </div>
            ) : (
              <SelectValue placeholder="Select a resource" />
            )}
          </SelectTrigger>
          <SelectContent>
            {resourceType === "playbook"
              ? groupedPlaybooks.map(([category, categoryPlaybooks]) => (
                  <SelectGroup key={category}>
                    <SelectLabel>{category}</SelectLabel>
                    {categoryPlaybooks.map((playbook) => (
                      <SelectItem
                        key={playbook.id}
                        value={playbook.id}
                        className="pr-2 [&>span.absolute]:hidden [&>span]:block [&>span]:w-full"
                      >
                        <div className="flex w-full items-center gap-2">
                          <span className="truncate">{playbook.name}</span>
                          {playbook.namespace ? (
                            <Badge
                              variant="secondary"
                              className="ml-auto px-1.5 py-0 text-[10px] font-medium"
                            >
                              {playbook.namespace}
                            </Badge>
                          ) : null}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))
              : sortedViews.map((view) => (
                  <SelectItem
                    key={view.id}
                    value={view.id}
                    className="pr-2 [&>span.absolute]:hidden [&>span]:block [&>span]:w-full"
                  >
                    <div className="flex w-full items-center gap-2">
                      <span className="truncate">{view.name}</span>
                      {view.namespace ? (
                        <Badge
                          variant="secondary"
                          className="ml-auto px-1.5 py-0 text-[10px] font-medium"
                        >
                          {view.namespace}
                        </Badge>
                      ) : null}
                    </div>
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function PermissionAccessCheckForm({
  config,
  isActive = true,
  onCancel
}: PermissionAccessCheckFormProps) {
  const [requestError, setRequestError] = useState<string>();
  const [result, setResult] = useState<{
    allowed: boolean;
    error?: string;
  }>();

  const lockedResource = config.lockedResource ?? config.resource;
  const allowedResourceTypes = useMemo(() => {
    if (lockedResource) {
      return [lockedResource.type] as PermissionAccessCheckResourceType[];
    }

    if (config.allowedResourceTypes && config.allowedResourceTypes.length > 0) {
      return config.allowedResourceTypes;
    }

    return ["playbook", "view"] as PermissionAccessCheckResourceType[];
  }, [config.allowedResourceTypes, lockedResource]);

  const initialResourceType =
    lockedResource?.type ?? allowedResourceTypes[0] ?? "playbook";

  const { data: subjects = [], isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["permission-subjects", "access-check-form"],
    queryFn: fetchPermissionSubjects,
    enabled: isActive
  });

  const { mutateAsync: checkAccess, isLoading: isCheckingAccess } = useMutation(
    {
      mutationFn: reviewSubjectAccess
    }
  );

  useEffect(() => {
    if (!isActive) {
      setResult(undefined);
      setRequestError(undefined);
    }
  }, [isActive]);

  const initialValues: PermissionAccessCheckFormValues = useMemo(
    () => ({
      resourceType: initialResourceType,
      resourceId: lockedResource?.id ?? "",
      subjectId: "",
      action: config.actions[0] ?? ""
    }),
    [config.actions, initialResourceType, lockedResource?.id]
  );

  return (
    <Formik<PermissionAccessCheckFormValues>
      initialValues={initialValues}
      enableReinitialize
      onSubmit={async (values, helpers) => {
        if (!values.subjectId) {
          helpers.setFieldError("subjectId", "Subject is required");
          return;
        }

        if (!values.action) {
          helpers.setFieldError("action", "Action is required");
          return;
        }

        const resourceOverride = values.action
          ? config.resourceOverrideByAction?.[values.action]
          : undefined;
        const shouldHideResourceSelector = values.action
          ? !!config.hideResourceForActions?.includes(values.action)
          : false;

        if (
          !resourceOverride &&
          !shouldHideResourceSelector &&
          !values.resourceId
        ) {
          helpers.setFieldError("resourceId", "Resource is required");
          return;
        }

        setRequestError(undefined);
        setResult(undefined);

        try {
          const response = await checkAccess({
            resource:
              resourceOverride ??
              (values.resourceType === "playbook"
                ? { playbook: values.resourceId }
                : { view: values.resourceId }),
            action: values.action,
            subjects: [values.subjectId]
          });

          const firstResult = response?.results?.[0];
          setResult(
            firstResult
              ? { allowed: firstResult.allowed, error: firstResult.error }
              : undefined
          );
        } catch (error) {
          setRequestError(getErrorMessage(error));
          setResult(undefined);
        } finally {
          helpers.setSubmitting(false);
        }
      }}
    >
      {({ values, setFieldValue, errors, isSubmitting }) => {
        const selectedSubject = subjects.find(
          (subject) => subject.id === values.subjectId
        );

        const shouldHideResourceSelector = values.action
          ? !!config.hideResourceForActions?.includes(values.action)
          : false;

        const resourceOverride = values.action
          ? config.resourceOverrideByAction?.[values.action]
          : undefined;

        const overrideResourceLabel = resourceOverride?.global
          ? resourceOverride.global.toUpperCase()
          : (resourceOverride?.playbook ?? resourceOverride?.view);

        const isCheckDisabled =
          !values.subjectId ||
          !values.action ||
          (!resourceOverride &&
            !shouldHideResourceSelector &&
            !values.resourceId) ||
          isCheckingAccess ||
          isSubmitting;

        const clearResult = () => {
          setResult(undefined);
          setRequestError(undefined);
        };

        return (
          <Form className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Subject</p>
              <Select
                value={values.subjectId || undefined}
                onValueChange={(value) => {
                  setFieldValue("subjectId", value);
                  clearResult();
                }}
              >
                <SelectTrigger>
                  {selectedSubject ? (
                    <div className="flex min-w-0 items-center gap-2">
                      <SubjectAvatar subject={selectedSubject} size="xs" />
                      <span className="truncate">{selectedSubject.name}</span>
                    </div>
                  ) : (
                    <SelectValue
                      placeholder={
                        isLoadingSubjects
                          ? "Loading subjects..."
                          : "Select a subject"
                      }
                    />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      <div className="flex items-center gap-2">
                        <SubjectAvatar subject={subject} size="xs" />
                        <span>{subject.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subjectId ? (
                <p className="text-sm text-red-500">{errors.subjectId}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Action</p>
              <Select
                value={values.action || undefined}
                onValueChange={(value) => {
                  setFieldValue("action", value);
                  clearResult();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an action" />
                </SelectTrigger>
                <SelectContent>
                  {config.actions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.action ? (
                <p className="text-sm text-red-500">{errors.action}</p>
              ) : null}
            </div>

            {!shouldHideResourceSelector ? (
              <>
                <PermissionAccessResourceSelector
                  resourceType={values.resourceType}
                  resourceId={values.resourceId}
                  setFieldValue={setFieldValue}
                  clearResult={clearResult}
                  lockedResource={lockedResource}
                  allowedResourceTypes={allowedResourceTypes}
                  isActive={isActive}
                />
                {errors.resourceId ? (
                  <p className="-mt-2 text-sm text-red-500">
                    {errors.resourceId}
                  </p>
                ) : null}
              </>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-medium">Resource</p>
                <p className="rounded-md border bg-muted px-3 py-2 text-sm">
                  {overrideResourceLabel ?? "N/A"}
                </p>
              </div>
            )}

            {requestError ? (
              <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                {requestError}
              </div>
            ) : null}

            {result ? (
              <div
                className={
                  result.allowed
                    ? "rounded-md border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-700"
                    : "rounded-md border border-amber-200 bg-amber-50 p-2 text-sm text-amber-700"
                }
              >
                {selectedSubject?.name ?? "Subject"} is
                {result.allowed ? " allowed " : " not allowed "}
                to perform <strong>{values.action}</strong>
                {result.error ? ` (${result.error})` : ""}
              </div>
            ) : null}

            <div className="flex justify-end gap-2">
              {onCancel ? (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              ) : null}
              <Button type="submit" disabled={isCheckDisabled}>
                {isCheckingAccess ? "Checking..." : "Check Access"}
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default function PermissionAccessCheckModal({
  open,
  onOpenChange,
  config
}: PermissionAccessCheckModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{config.title ?? "Permission Access Check"}</DialogTitle>
          <DialogDescription>
            {config.description ??
              "Select a subject and action to check access for this resource."}
          </DialogDescription>
        </DialogHeader>

        <PermissionAccessCheckForm
          config={config}
          isActive={open}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
