import { Button } from "./Button";

type ActionLinkProps = {
  onClick?: () => void;
  icon: React.ReactNode;
  text: React.ReactNode;
};

export function ActionLink({
  onClick = () => {},
  icon,
  text
}: ActionLinkProps) {
  return (
    <div className="flex flex-col items-center">
      <Button
        icon={icon}
        text={text}
        onClick={() => onClick()}
        className="btn-white text-sm"
      />
    </div>
  );
}
