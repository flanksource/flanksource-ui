type Props = {
  title: string;
  icon: React.ReactNode;
};

export default function Title({ title, icon }: Props) {
  return (
    <h3 className="flex flex-row items-center justify-center space-x-1">
      <div className="inline-block text-zinc-400">{icon}</div>
      <span className="text-lg text-zinc-800">{title}</span>
    </h3>
  );
}
