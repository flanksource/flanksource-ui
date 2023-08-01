import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  activeStep: 1 | 2;
};

export default function SignUpLayout({ children, activeStep = 1 }: Props) {
  return (
    <div className="w-full px-3 text-center flex flex-col">
      <div className="flex flex-col mb-12">
        <div className="flex flex-col items-center p-8 text-black">
          <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
            <li
              className={clsx(
                `flex w-full items-center sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10`,
                activeStep === 1 && "text-blue-600"
              )}
            >
              <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
                <span className="mr-2">1</span>
                <span>Create Account</span>
              </span>
            </li>
            <li
              className={clsx(
                `flex md:w-full items-center  dark:after:border-gray-700`,
                activeStep === 2 && "text-blue-600"
              )}
            >
              <span className="flex items-center ">
                <span className="mr-2">2</span>
                Create Organization
              </span>
            </li>
          </ol>
        </div>
        <div className="flex flex-col items-center">{children}</div>
      </div>
    </div>
  );
}
