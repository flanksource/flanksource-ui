type Props = {
  title: string;
  icon: React.ReactNode;
};

export default function Title({ title, icon }: Props) {
  return (
    <h3 className="flex flex-row space-x-1 items-center justify-center">
      <div className="text-zinc-400 inline-block">{icon}</div>
      <span className="text-zinc-800 text-lg">{title}</span>
    </h3>
  );
}
