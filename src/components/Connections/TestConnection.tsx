import { testConnection } from "@flanksource-ui/api/services/connections";
import { AlertMessageDialog } from "@flanksource-ui/ui/AlertDialog/AlertMessageDialog";
import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";
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

  const formatErrorMessage = (
    payload: unknown
  ): React.ReactNode | undefined => {
    if (payload === undefined || payload === null) {
      return undefined;
    }
    if (typeof payload === "string") {
      try {
        const parsed = JSON.parse(payload);
        return (
          <JSONViewer code={JSON.stringify(parsed, null, 2)} format="json" />
        );
      } catch (e) {
        return payload;
      }
    }
    return <JSONViewer code={JSON.stringify(payload, null, 2)} format="json" />;
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
      }>
    ) => {
      const responseData = res?.response?.data as {
        error?: string;
        message?: string;
      } | null;

      const formattedMessage = formatErrorMessage(
        responseData?.error ?? responseData?.message ?? responseData
      );

      if (formattedMessage) {
        setMessage({
          message: formattedMessage,
          kind: "error"
        });
        return;
      }

      if (res?.code === "ERR_NOT_IMPLEMENTED") {
        setMessage({
          message: "We currently do not support testing this connection type",
          kind: "error"
        });
        return;
      }

      setMessage({
        message: res?.message || "Testing connection failed!",
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
