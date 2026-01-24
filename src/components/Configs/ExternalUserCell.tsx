import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@flanksource-ui/components/ui/tooltip";

export interface ExternalUser {
  name: string;
  user_email?: string | null;
}

interface ExternalUserCellProps {
  user: ExternalUser | null | undefined;
}

export function ExternalUserCell({ user }: ExternalUserCellProps) {
  if (!user) {
    return <span className="text-gray-400">—</span>;
  }

  const { name, user_email } = user;

  // If no email, just show the name
  if (!user_email) {
    return <span className="font-medium">{name}</span>;
  }

  // If email exists, wrap with tooltip
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help border-b border-dashed border-gray-300 font-medium">
          {name}
        </span>
      </TooltipTrigger>
      <TooltipContent side="right" className="bg-slate-900 text-white">
        <div className="space-y-1 text-xs">
          <div className="font-semibold">{name}</div>
          <div className="text-gray-200">{user_email}</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
