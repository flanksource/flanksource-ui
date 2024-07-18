import React from "react";

type BannerMessageProps = {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  prepend?: React.ReactNode;
  append?: React.ReactNode;
};

const BannerMessageFC = ({
  title,
  subtitle,
  prepend,
  append
}: BannerMessageProps) => (
  <div className="flex flex-col items-center justify-center p-16 text-center">
    <div>{prepend}</div>
    <div className="mb-2 text-4xl font-bold text-gray-800">{title}</div>
    <div className="text-md mb-4 text-gray-400">{subtitle}</div>
    <div>{append}</div>
  </div>
);

export const BannerMessage = React.memo(BannerMessageFC);
