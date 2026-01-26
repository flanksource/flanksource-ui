import { useMemo } from "react";
import markdownit from "markdown-it";
import { sanitizeHTMLContent } from "@flanksource-ui/utils/common";

export function DisplayMarkdown({
  md,
  className
}: {
  md?: string;
  className?: string;
}) {
  const html = useMemo(() => {
    if (!md) {
      return null;
    }

    const renderer = markdownit({
      html: true,
      linkify: true
    });
    const rendered = renderer.render(md);

    // Add borders/padding to markdown tables for better readability
    const withTableStyling = rendered
      .replace(
        /<table>/g,
        '<table class="w-full border-collapse border border-gray-700">'
      )
      .replace(
        /<th>/g,
        '<th class="border border-gray-700 bg-gray-900 px-3 py-1 text-left">'
      )
      .replace(
        /<td>/g,
        '<td class="border border-gray-700 px-3 py-1 align-top">'
      );

    // Sanitize the rendered HTML to prevent XSS attacks
    return sanitizeHTMLContent(withTableStyling);
  }, [md]);

  if (!html) {
    return null;
  }

  return (
    <pre
      className={className}
      dangerouslySetInnerHTML={{
        __html: html
      }}
    />
  );
}
