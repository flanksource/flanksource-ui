import React, { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface SectionProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon: Icon, children }) => {
  return (
    <div>
      <h3 className="mb-4 flex items-center text-xl font-semibold">
        <Icon className="mr-2 text-teal-600" size={20} />
        {title}
      </h3>
      <div className="space-y-6">{children}</div>
    </div>
  );
};

export default Section;
