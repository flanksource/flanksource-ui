import { useMemo } from "react";
import markdownit from "markdown-it";
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
    return renderer.render(md);
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
