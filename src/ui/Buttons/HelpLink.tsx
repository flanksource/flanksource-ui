import { IoMdHelp } from "react-icons/io";

export default function HelpLink({ link }: { link: string }) {
  return (
    <a
      title="Link to documentation"
      href={`https://docs.flanksource.com/${link}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none"
    >
      <IoMdHelp size={22} className="inline-block" />
    </a>
  );
}
