import { QuestionMarkCircleIcon } from "@heroicons/react/solid";

type HelpLinkProps = {
  link: string;
  iconID?: string;
  title?: string;
  className?: string;
};

export default function HelpLink({
  link,
  title,
  iconID,
  className
}: HelpLinkProps) {
  const url = new URL(link, "https://docs.flanksource.com/");
  const defaultClass =
    "flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none";
  const classes = className ? className : defaultClass;
  if (title === undefined) {
    title = "Link to documentation";
  }

  return (
    <a
      title={title}
      href={url.toString()}
      target="_blank"
      rel="noopener noreferrer"
      className={classes}
    >
      <QuestionMarkCircleIcon
        id={iconID}
        className="ml-1 inline-block h-4 w-4 text-current"
      />
    </a>
  );
}
