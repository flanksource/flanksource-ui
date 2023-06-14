import React, { ErrorInfo, ReactNode } from "react";
import ErrorPage from "./ErrorPage";

type Props = {
  children?: ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

class DashboardErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      return <ErrorPage error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default DashboardErrorBoundary;
