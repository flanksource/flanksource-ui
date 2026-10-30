import { PermissionSubject } from "@flanksource-ui/api/services/permissions";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import clsx from "clsx";
import { IconType } from "react-icons";
import { HiBadgeCheck, HiPuzzle, HiUserGroup } from "react-icons/hi";

// role is kept for the subjects of the deprecated Permissions
export type PermissionSubjectType = PermissionSubject["type"] | "role";

type SubjectAvatarSize = "xs" | "md";

type SubjectAvatarProps = {
  subject: Pick<PermissionSubject, "name" | "icon"> & {
    type: PermissionSubjectType;
  };
  size?: SubjectAvatarSize;
  className?: string;
};

const SUBJECT_TYPE_ICON_CONFIG: Record<
  Exclude<PermissionSubjectType, "person" | "playbook">,
  {
    Icon: IconType;
    colors: string;
  }
> = {
  team: {
    Icon: HiUserGroup,
    colors: "bg-blue-100 text-blue-700"
  },
  role: {
    Icon: HiBadgeCheck,
    colors: "bg-indigo-50 text-indigo-700"
  },
  plugin: {
    Icon: HiPuzzle,
    colors: "bg-amber-50 text-amber-700"
  }
};

const SIZE_CLASSNAMES: Record<
  SubjectAvatarSize,
  { wrapper: string; icon: string }
> = {
  xs: {
    wrapper: "h-5 w-5 rounded-full",
    icon: "h-3 w-3"
  },
  md: {
    wrapper: "h-8 w-8 rounded-md",
    icon: "h-4 w-4"
  }
};

export default function SubjectAvatar({
  subject,
  size = "xs",
  className
}: SubjectAvatarProps) {
  if (subject.type === "person") {
    return (
      <Avatar
        size={size === "md" ? "md" : "xs"}
        user={{ name: subject.name }}
        containerProps={{
          className: clsx(
            size === "md" ? "[&>span]:!text-[10px]" : "[&>span]:!text-[10px]",
            className
          )
        }}
      />
    );
  }

  const sizeClassName = SIZE_CLASSNAMES[size];

  if (subject.type === "playbook") {
    return (
      <span
        className={clsx(
          "flex shrink-0 items-center justify-center bg-emerald-50 text-emerald-700",
          sizeClassName.wrapper,
          className
        )}
      >
        <Icon
          name={subject.icon || "playbook"}
          className={sizeClassName.icon}
        />
      </span>
    );
  }

  const { Icon: SubjectTypeIcon, colors } =
    SUBJECT_TYPE_ICON_CONFIG[subject.type];

  return (
    <span
      className={clsx(
        "flex shrink-0 items-center justify-center",
        colors,
        sizeClassName.wrapper,
        className
      )}
    >
      <SubjectTypeIcon className={sizeClassName.icon} />
    </span>
  );
}
