import { useGetConfigByIdQuery } from "@flanksource-ui/api/query-hooks";
import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import { usePartialUpdateSearchParams } from "@flanksource-ui/hooks/usePartialUpdateSearchParams";
import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";
import { Loading } from "@flanksource-ui/ui/Loading";
import { Button } from "@flanksource-ui/components/ui/button";
import { useAiChatPopover } from "@flanksource-ui/components/ai/AiChatPopover";
import { toastError } from "@flanksource-ui/components/Toast/toast";
import { Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

export function ConfigDetailsPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = usePartialUpdateSearchParams();
  const [checked, setChecked] = useState<Record<string, any>>({});

  const {
    isLoading,
    data: configDetails,
    refetch
  } = useGetConfigByIdQuery(id!);

  useEffect(() => {
    if (!configDetails?.config) {
      return;
    }

    const selected = searchParams.getAll("selected");
    setChecked(Object.fromEntries(selected.map((x) => [x, true])));
  }, [searchParams, configDetails]);

  useEffect(() => {
    const selected = Object.keys(checked);
    setSearchParams({ selected });
  }, [checked, setSearchParams]);

  const handleClick = useCallback((idx: any) => {
    setChecked((checked) => {
      const obj = { ...checked };
      if (obj[idx]) {
        delete obj[idx];
      } else {
        obj[idx] = true;
      }
      return obj;
    });
  }, []);

  const code = useMemo(() => {
    if (configDetails === null || !configDetails?.config) {
      return "";
    }
    if (configDetails?.config?.content != null) {
      return configDetails?.config.content;
    }

    const ordered = Object.keys(configDetails.config)
      .sort()
      .reduce((obj: Record<string, any>, key) => {
        if (configDetails.config) {
          obj[key] = configDetails.config[key];
        }
        return obj;
      }, {});

    return configDetails?.config && JSON.stringify(ordered, null, 2);
  }, [configDetails]);

  const format = useMemo(
    () =>
      configDetails?.config?.format != null
        ? configDetails?.config.format
        : "json",
    [configDetails]
  );

  return (
    <ConfigDetailsTabs
      pageTitlePrefix={"Catalog"}
      isLoading={isLoading}
      refetch={refetch}
      activeTabName="Spec"
      className=""
      extra={
        <SendToAiButton configId={configDetails?.id} isLoading={isLoading} />
      }
    >
      <div className="relative flex min-h-0 flex-1 flex-col">
        {!isLoading ? (
          <div className="relative flex min-h-0 w-full flex-1 flex-col border-gray-300 bg-white">
            <JSONViewer
              code={code}
              format={format}
              showLineNo
              convertToYaml
              onClick={handleClick}
              selections={checked}
              fillHeight
            />
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center">
            <Loading />
          </div>
        )}
      </div>
    </ConfigDetailsTabs>
  );
}

type SendToAiButtonProps = {
  configId?: string;
  isLoading?: boolean;
};

function SendToAiButton({ configId, isLoading }: SendToAiButtonProps) {
  const { setOpen, setChatMessages, setQuickPrompts } = useAiChatPopover();
  const [isSending, setIsSending] = useState(false);
  const disabled = isLoading || isSending || !configId;

  const handleSendToAi = useCallback(async () => {
    if (!configId) {
      return;
    }

    setIsSending(true);
    const quickPrompts = [
      "Summarize this",
      "why is this unhealthy",
      "Recommend ways to improve this"
    ];

    try {
      const url = new URL(
        `/api/llm/context/config/${encodeURIComponent(configId)}`,
        window.location.origin
      );
      const response = await fetch(url.toString(), { method: "GET" });

      if (!response.ok) {
        let message: unknown = `Failed to fetch AI context (${response.status})`;
        try {
          message = await response.json();
        } catch {
          // ignore parsing errors
        }
        toastError(message as any);
        return;
      }

      const json = (await response.json()) as unknown;
      switch ((json as Record<string, any>).configs[0].type) {
        case "Kubernetes::Pod":
          quickPrompts.push(
            "Plot a timeseries for the container memory usage (in MB) of this pod in the last 30 minutes with 1m resolution"
          );
          break;
        case "Kubernetes::Deployment":
          quickPrompts.push(
            "Plot a timeseries for the container memory usage (in MB) of this deployment in the last 30 minutes with 1m resolution"
          );
          break;
      }

      const jsonText =
        typeof json === "string" ? json : JSON.stringify(json, null, 2);
      const text = [
        "Config details and it's related configs:",
        "```json",
        jsonText,
        "```"
      ]
        .filter(Boolean)
        .join("\n\n");

      setChatMessages([
        {
          id: `user-${Date.now()}`,
          role: "user",
          parts: [{ type: "text", text }]
        }
      ]);
      setQuickPrompts(quickPrompts);
      setOpen(true);
    } catch (error) {
      toastError(error as any);
    } finally {
      setIsSending(false);
    }
  }, [configId, setChatMessages, setOpen, setQuickPrompts]);

  return (
    <Button
      onClick={handleSendToAi}
      disabled={disabled}
      size="sm"
      variant="outline"
      className="flex items-center gap-2"
    >
      <Sparkles className="h-4 w-4" />
      {isSending ? "Sending..." : "Send to AI"}
    </Button>
  );
}
