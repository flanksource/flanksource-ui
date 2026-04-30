import { Artifact } from "@flanksource-ui/api/types/artifacts";
import {
  artifactDownloadURL,
  downloadArtifact
} from "@flanksource-ui/api/services/artifacts";
import { formatBytes } from "@flanksource-ui/utils/common";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@flanksource-ui/components/ui/dialog";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import CodeBlock from "@flanksource-ui/ui/Code/CodeBlock";
import { darkTheme } from "@flanksource-ui/ui/Code/JSONViewerTheme";
import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";
import { DisplayMarkdown } from "@flanksource-ui/components/Utils/Markdown";
import { useQuery } from "@tanstack/react-query";
import { IoMdDownload } from "react-icons/io";

type ArtifactPreviewModalProps = {
  artifact: Artifact | undefined;
  onClose: () => void;
};

const MAX_PREVIEW_SIZE = 50 * 1024 * 1024; // 50MB

function isImageContentType(contentType: string) {
  return contentType.startsWith("image/");
}

export function ArtifactPreviewModal({
  artifact,
  onClose
}: ArtifactPreviewModalProps) {
  const isSmallFile = artifact ? artifact.size < MAX_PREVIEW_SIZE : false;

  const isImage = artifact ? isImageContentType(artifact.content_type) : false;

  const { data: content, isFetching: isLoading } = useQuery({
    queryKey: ["artifact", artifact?.id],
    queryFn: () => downloadArtifact(artifact!.id),
    enabled: !!artifact && isSmallFile && !isImage,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 60 * 24
  });

  const downloadURL = artifact
    ? artifactDownloadURL(artifact.id, artifact.filename)
    : undefined;

  return (
    <Dialog open={!!artifact} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{artifact?.filename}</span>
            {artifact && (
              <span className="text-sm font-normal text-gray-500">
                ({formatBytes(artifact.size)})
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-auto">
          {artifact && !isSmallFile && (
            <div className="py-8 text-center text-gray-500">
              <p className="mb-4">
                File is too large to preview. Maximum file size is 50MB.
              </p>
              <a href={downloadURL} target="_blank" rel="noreferrer">
                <Button text="Download" icon={<IoMdDownload />} />
              </a>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-500" />
              <span className="ml-2">Loading...</span>
            </div>
          )}

          {isImage && artifact && downloadURL && (
            <img
              src={downloadURL}
              alt={artifact.filename}
              className="max-h-[60vh] max-w-full object-contain"
            />
          )}

          {content &&
            artifact &&
            !isImage &&
            renderContent(artifact.content_type, content)}
        </div>

        <DialogFooter className="pt-2">
          {downloadURL && (
            <a href={downloadURL} target="_blank" rel="noreferrer">
              <Button
                text="Download"
                icon={<IoMdDownload />}
                className="btn-secondary"
              />
            </a>
          )}
          <Button text="Close" onClick={onClose} className="btn-primary" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function renderContent(contentType: string, content: string) {
  switch (contentType) {
    case "text/x-shellscript":
      return (
        <CodeBlock
          code={content}
          language="bash"
          className="bg-black text-white"
          codeBlockClassName="whitespace-pre"
          theme={darkTheme}
        />
      );

    case "application/sql":
      return (
        <CodeBlock
          code={content}
          language="sql"
          className="bg-black text-white"
          codeBlockClassName="whitespace-pre"
          theme={darkTheme}
        />
      );

    case "text/markdown":
    case "markdown":
      return <DisplayMarkdown md={content} />;

    case "application/yaml":
    case "application/json":
      return (
        <pre>
          <JSONViewer format="json" code={content} convertToYaml />
        </pre>
      );

    case "text/plain":
    default:
      return (
        <pre className="whitespace-pre-wrap bg-gray-50 p-4 text-sm">
          {content}
        </pre>
      );
  }
}
