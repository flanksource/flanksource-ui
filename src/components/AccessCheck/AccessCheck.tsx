import { useUserAccessStateContext } from "../../context/UserAccessContext";

type AccessCheckProps = React.HTMLProps<HTMLDivElement> & {
  resource: string;
};

export function AccessCheck({
  resource,
  className,
  children,
  ...props
}: AccessCheckProps) {
  const { hasResourceAccess } = useUserAccessStateContext();
  return (
    <div className={className} {...props}>
      {hasResourceAccess(resource) && children}
    </div>
  );
}
