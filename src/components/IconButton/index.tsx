import { useState } from "react";
import clsx from "clsx";
import { Oval } from "react-loading-icons";

interface Props {
  className?: string;
  title?: string;
  icon?: React.ReactElement;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  ovalProps?: React.SVGAttributes<SVGSVGElement>;
}

export const IconButton = ({
  className,
  icon,
  onClick,
  ovalProps = {},
  ...rest
}: Props) => {
  const [inProgress, setInProgress] = useState<boolean>(false);

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onClick) return;
    setInProgress(true);
    Promise.resolve(onClick(e)).finally(() => setInProgress(false));
  };

  return (
    <button
      type="button"
      onClick={handleOnClick}
      disabled={inProgress}
      className={clsx(className, inProgress && "disabled")}
      {...rest}
    >
      {inProgress ? <Oval stroke="blue" height="1em" {...ovalProps} /> : icon}
    </button>
  );
};
