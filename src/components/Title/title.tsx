export default function Title({ title, icon }) {
  return (
    <h3 className="flex flex-row mb-2">
      <div className="text-zinc-400 pr-1 inline-block">{icon}</div>
      <span className="text-zinc-800 text-lg">{title}</span>
    </h3>
  );
}
