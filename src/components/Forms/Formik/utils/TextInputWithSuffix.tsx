type TextInputWithSuffixProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function TextInputWithSuffix({
  className,
  ...props
}: TextInputWithSuffixProps) {
  return (
    <input
      className={`block w-full rounded-md border-0 py-1.5 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${className}`}
      {...props}
    />
  );
}
