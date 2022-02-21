export function BannerMessage({ title, subtitle, prepend, append }) {
  return (
    <div className="flex flex-col p-16 items-center justify-center text-center">
      <div>{prepend}</div>
      <div className="text-4xl text-gray-800 font-bold mb-2">{title}</div>
      <div className="text-md text-gray-400 mb-4">{subtitle}</div>
      <div>{append}</div>
    </div>
  );
}
