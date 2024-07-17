import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import React, { ComponentProps, useMemo, useState } from "react";
import { AttachEvidenceDialog } from ".";
import { useFeatureFlagsContext } from "../../../context/FeatureFlagsContext";
import { features } from "../../../services/permissions/features";
import { Button } from "../../../ui/Buttons/Button";

type AttachAsEvidenceButtonProps = Omit<
  ComponentProps<typeof AttachEvidenceDialog>,
  "isOpen" | "onClose"
> & {
  isDisabled?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
  buttonComponent?: React.ComponentType<{
    onClick: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    disabled?: boolean;
  }>;
};

export default function AttachAsEvidenceButton({
  isDisabled,
  onClick = () => {},
  className,
  buttonComponent: ButtonComponent,
  ...props
}: AttachAsEvidenceButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isFeatureDisabled } = useFeatureFlagsContext();

  const isIncidentManagementFeatureDisabled = useMemo(
    () => isFeatureDisabled(features.incidents),
    [isFeatureDisabled]
  );

  if (isIncidentManagementFeatureDisabled) {
    return null;
  }

  return (
    <AuthorizationAccessCheck action="write" resource={"incidents"}>
      <>
        {ButtonComponent ? (
          <ButtonComponent
            onClick={(e) => {
              onClick(e);
              setIsDialogOpen(true);
            }}
            disabled={isDisabled}
          />
        ) : (
          <Button
            type="button"
            disabled={isDisabled}
            onClick={(e) => {
              onClick(e);
              setIsDialogOpen(true);
            }}
            hidden={isDisabled}
            className={className}
            text="Attach as Evidence"
          />
        )}
        <AttachEvidenceDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          {...props}
        />
      </>
    </AuthorizationAccessCheck>
  );
}
