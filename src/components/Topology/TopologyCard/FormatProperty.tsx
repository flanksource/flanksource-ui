import { Property as PropertyD } from "@flanksource-ui/api/types/topology";
import { Age } from "@flanksource-ui/ui/Age";
import Image from "next/image";
import { FiExternalLink } from "react-icons/fi";
import {
  FormatPropertyCPUMemory,
  FormatPropertyCurrency,
  FormatPropertyDefault,
  FormatPropertyPercent,
  FormatPropertyURL
} from "./Utils/FormatProperties";

type FormatPropertyProps = {
  property: PropertyD;
  short?: boolean;
  isSidebar?: boolean;
};

export function FormatProperty({
  property,
  short = false,
  isSidebar = false
}: FormatPropertyProps) {
  if (property == null) {
    return null;
  }

  let { text } = property;

  if (
    (property.name === "created" ||
      property.name === "created_at" ||
      property.name === "updated_at" ||
      property.type === "age") &&
    typeof text === "string"
  ) {
    return <Age from={text} />;
  }

  if (property.type === "url") {
    return <FormatPropertyURL property={property} short={short} />;
  }

  if (property.type === "badge") {
    return (
      <Image
        src={property.text!}
        alt={property.label || property.name}
        height={20}
        width={80}
        className="inline-block h-5 w-auto"
      />
    );
  }

  if (property.type === "currency") {
    return <FormatPropertyCurrency property={property} short={short} />;
  }

  if (property.name === "cpu" || property.name === "memory") {
    return (
      <FormatPropertyCPUMemory
        property={property}
        isSidebar={isSidebar}
        short={short}
      />
    );
  }

  if (property.unit === "percent") {
    return <FormatPropertyPercent property={property} short={short} />;
  }

  if (
    (property.type === "text" || !property.type) &&
    !property.value &&
    property.links
  ) {
    return (
      <div className="flex flex-wrap gap-2">
        {property.links?.map((link) => (
          <a
            key={link.url}
            href={link.url}
            className="link"
            target="_blank"
            rel="noreferrer"
          >
            {link.label}
            <FiExternalLink className="ml-1 inline" size={12} />
          </a>
        ))}
      </div>
    );
  }

  return <FormatPropertyDefault property={property} short={short} />;
}
