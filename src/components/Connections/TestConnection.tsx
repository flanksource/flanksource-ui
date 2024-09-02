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
      if (res?.code === "ERR_BAD_REQUEST") {
        if (res?.response?.data.error) {
          try {
            const error = JSON.parse(res.response.data.error);
            setMessage({
              message: (
                <JSONViewer
                  code={JSON.stringify(error, null, 2)}
                  format={"json"}
                />
              ),
              kind: "error"
            });
          } catch (e) {
            setMessage({
              message:
                res?.response?.data.error ?? "Testing connection failed!",
              kind: "error"
            });
          }
          return;
        }
        setMessage({
          message: res?.response?.data.error ?? "Testing connection failed!",
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
        message: "Testing connection failed!",
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
