type PillBadgeProps = {
  children: React.ReactNode;
  className?: string;
};

export default function PillBadge({
  children,
  className = "bg-blue-100 text-blue-800 text-sm"
}: PillBadgeProps) {
  return (
    <span className={`font-semibold px-2.5 py-0.5 rounded-full ${className}`}>
      {children}
    </span>
  );
}
