import { testConnection } from "@flanksource-ui/api/services/connections";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@flanksource-ui/components/ui/dialog";
import CodeBlock from "@flanksource-ui/ui/Code/CodeBlock";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { Button } from "..";
import { darkTheme } from "@flanksource-ui/ui/Code/JSONViewerTheme";

type TestConnectionProps = {
  connectionId: string;
};

export function TestConnection({ connectionId }: TestConnectionProps) {
  const [message, setMessage] = useState<{
    message?: React.ReactNode;
    kind?: "error" | "success";
  }>();

  const renderSuccessMessage = (payload: unknown) => {
    if (payload === undefined || payload === null || payload === "") {
      return undefined;
    }

    return (
      <CodeBlock
        theme={darkTheme}
        code={JSON.stringify(payload, null, 2)}
        language="json"
      />
    );
  };

  const { mutate: test, isLoading } = useMutation({
    mutationKey: ["testConnection", connectionId],
    mutationFn: () => {
      return testConnection(connectionId);
    },
    onSuccess: (res) => {
      if (!res) {
        return;
      }
      setMessage({
        message: renderSuccessMessage(res.data?.payload),
        kind: "success"
      });
    },
    onError: (
      res: AxiosError<{
        error?: string;
        message?: string;
      }>
    ) => {
      setMessage({
        message: <ErrorViewer error={res} />,
        kind: "error"
      });
    }
  });

  return (
    <>
      <Button
        text={isLoading ? "Testing..." : "Test Connection"}
        onClick={() => test()}
        className="btn-secondary"
      />
      <Dialog
        open={!!message}
        onOpenChange={(open) => {
          if (!open) {
            setMessage(undefined);
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Test Connection Results</DialogTitle>
          </DialogHeader>
          {message?.kind && (
            <div
              className={
                message.kind === "error"
                  ? "text-sm font-medium text-red-600"
                  : "text-sm font-medium text-green-700"
              }
            >
              {message.kind === "error"
                ? "Connection failed"
                : "Connection successful"}
            </div>
          )}
          {message?.message && (
            <div className="max-h-[60vh] overflow-auto text-sm">
              {message.message}
            </div>
          )}
          <DialogFooter className="pt-2">
            <Button
              className={
                message?.kind === "error" ? "btn-danger" : "btn-primary"
              }
              text="Close"
              onClick={() => setMessage(undefined)}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
