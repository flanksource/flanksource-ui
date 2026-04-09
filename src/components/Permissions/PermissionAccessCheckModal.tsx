import {
  fetchPermissionSubjects,
  PermissionSubject
} from "@flanksource-ui/api/services/permissions";
import {
  reviewSubjectAccess,
  SubjectAccessReviewAction
} from "@flanksource-ui/api/services/rbac";
import { getErrorMessage } from "@flanksource-ui/api/types/error";
import FormikResourceSelectorDropdown from "@flanksource-ui/components/Forms/Formik/FormikResourceSelectorDropdown";
import { Button } from "@flanksource-ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@flanksource-ui/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@flanksource-ui/components/ui/select";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { HiUser, HiUserGroup } from "react-icons/hi";

export type PermissionAccessCheckConfig = {
  resource: {
    type: "playbook" | "view";
    id: string;
    name?: string;
  };
  actions: SubjectAccessReviewAction[];
  title?: string;
  description?: string;
};

type PermissionAccessCheckModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: PermissionAccessCheckConfig;
};

type ResourceScopeLabel = "Configs" | "Checks";

type PermissionAccessCheckFormValues = {
  subjectId: string;
  action: SubjectAccessReviewAction | "";
  targetResourceId: string;
};

function SubjectIcon({ subject }: { subject: PermissionSubject }) {
  if (subject.type === "person") {
    return <Avatar size="xs" user={{ name: subject.name }} />;
  }

  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
      {subject.type === "team" ||
      subject.type === "permission_subject_group" ||
      subject.type === "role" ? (
        <HiUserGroup className="h-3 w-3" />
      ) : (
        <HiUser className="h-3 w-3" />
      )}
    </span>
  );
}

export default function PermissionAccessCheckModal({
  open,
  onOpenChange,
  config
}: PermissionAccessCheckModalProps) {
  const [resourceScope, setResourceScope] =
    useState<ResourceScopeLabel>("Configs");
  const [result, setResult] = useState<{
    allowed: boolean;
    error?: string;
  }>();
  const [requestError, setRequestError] = useState<string>();

  const { data: subjects = [], isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["permission-subjects", "access-check-modal"],
    queryFn: fetchPermissionSubjects,
    enabled: open
  });

  const { mutateAsync: checkAccess, isLoading: isCheckingAccess } = useMutation(
    {
      mutationKey: [
        "subject-access-review",
        config.resource.type,
        config.resource.id
      ],
      mutationFn: reviewSubjectAccess
    }
  );

  useEffect(() => {
    if (!open) {
      setResourceScope("Configs");
      setResult(undefined);
      setRequestError(undefined);
    }
  }, [open]);

  const initialValues: PermissionAccessCheckFormValues = useMemo(
    () => ({
      subjectId: "",
      action: config.actions[0] ?? "",
      targetResourceId: ""
    }),
    [config.actions]
  );

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

            setRequestError(undefined);
            setResult(undefined);

            try {
              const response = await checkAccess({
                resource:
                  config.resource.type === "playbook"
                    ? {
                        playbook: config.resource.id,
                        ...(resourceScope === "Configs" &&
                        values.targetResourceId
                          ? { config: values.targetResourceId }
                          : {}),
                        ...(resourceScope === "Checks" &&
                        values.targetResourceId
                          ? { check: values.targetResourceId }
                          : {})
                      }
                    : { view: config.resource.id },
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

            const isCheckDisabled =
              !values.subjectId ||
              !values.action ||
              isCheckingAccess ||
              isSubmitting;

            return (
              <Form className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Resource</p>
                  <p className="rounded-md border bg-muted px-3 py-2 text-sm">
                    {config.resource.name ?? config.resource.id}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Subject</p>
                  <Select
                    value={values.subjectId || undefined}
                    onValueChange={(value) => {
                      setFieldValue("subjectId", value);
                      setResult(undefined);
                      setRequestError(undefined);
                    }}
                  >
                    <SelectTrigger>
                      {selectedSubject ? (
                        <div className="flex min-w-0 items-center gap-2">
                          <SubjectIcon subject={selectedSubject} />
                          <span className="truncate">
                            {selectedSubject.name}
                          </span>
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
                            <SubjectIcon subject={subject} />
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

                {config.resource.type === "playbook" ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Target Resource</p>
                    <Switch<ResourceScopeLabel>
                      options={["Configs", "Checks"]}
                      value={resourceScope}
                      onChange={(value) => {
                        setResourceScope(value);
                        setFieldValue("targetResourceId", "");
                        setResult(undefined);
                        setRequestError(undefined);
                      }}
                      className="w-full"
                    />
                    {resourceScope === "Configs" ? (
                      <FormikResourceSelectorDropdown
                        name="targetResourceId"
                        label="Config"
                        hintLink
                        configResourceSelector={[{}]}
                        className="flex flex-col space-y-2"
                      />
                    ) : (
                      <FormikResourceSelectorDropdown
                        name="targetResourceId"
                        label="Check"
                        hintLink
                        checkResourceSelector={[{}]}
                        className="flex flex-col space-y-2"
                      />
                    )}
                    <p className="text-xs text-gray-500">
                      Optional: narrow the access review to a specific config or
                      check.
                    </p>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <p className="text-sm font-medium">Action</p>
                  <Select
                    value={values.action || undefined}
                    onValueChange={(value) => {
                      setFieldValue("action", value);
                      setResult(undefined);
                      setRequestError(undefined);
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

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCheckDisabled}>
                    {isCheckingAccess ? "Checking..." : "Check Access"}
                  </Button>
                </DialogFooter>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
