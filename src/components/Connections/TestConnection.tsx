import { testConnection } from "@flanksource-ui/api/services/connections";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";
import { AlertMessageDialog } from "@flanksource-ui/ui/AlertDialog/AlertMessageDialog";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { Button } from "..";

type TestConnectionProps = {
  connectionId: string;
};

export function TestConnection({ connectionId }: TestConnectionProps) {
  const [message, setMessage] = useState<{
    message?: React.ReactNode;
    kind?: "error" | "success";
  }>();

  const parseMaybeJson = (payload: unknown): unknown => {
    if (typeof payload !== "string") {
      return payload;
    }
    try {
      return JSON.parse(payload);
    } catch (e) {
      return payload;
    }
  };

  const { mutate: test, isLoading } = useMutation({
    mutationKey: ["testConnection", connectionId],
    mutationFn: () => {
      return testConnection(connectionId);
    },
    onSuccess: (res) => {
      if (res?.status === 200 && res.data?.message === "ok") {
        setMessage({
          message: "Connection successful",
          kind: "success"
        });
        return;
      }
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
      {message && (
        <AlertMessageDialog
          showDialog={!!message}
          message={message?.message}
          kind={message?.kind}
          title="Test Connection Results"
          onCloseDialog={() => {
            setMessage(undefined);
          }}
        />
      )}
    </>
  );
}
