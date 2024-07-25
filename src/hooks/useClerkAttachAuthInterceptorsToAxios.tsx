import { useAuth, useOrganization } from "@clerk/nextjs";
import {
  Auth,
  CanaryChecker,
  Config,
  ConfigDB,
  IncidentCommander,
  Logs,
  Rback,
  redirectToLoginPageOnSessionExpiry,
  Snapshot
} from "@flanksource-ui/api/axios";
import { toastError } from "@flanksource-ui/components/Toast/toast";
import { useEffect } from "react";

const allAxiosInstances = [
  Auth,
  IncidentCommander,
  Logs,
  CanaryChecker,
  Config,
  ConfigDB,
  Rback,
  Snapshot
];

function parseBoolean(value: unknown): boolean {
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "undefined" || value === null) {
    return false;
  }
  throw new Error("Invalid boolean value");
}

export default function useClerkAttachAuthInterceptorsToAxios() {
  const { getToken } = useAuth();
  const { organization } = useOrganization();

  // we should only get to this point if the user is logged in and has an
  // organization set
  const backendUrl = organization?.publicMetadata.backend_url as string;

  // we need to know if th organization supports direct access to the backend or
  // not so we can set the base URL correctly
  const direct = parseBoolean(organization?.publicMetadata.direct);

  console.log({ direct });

  useEffect(() => {
    // if the organization does not support direct access to the backend, we
    // should not attach the interceptors
    if (!direct) {
      return;
    }

    const interceptorsRequestCleanups: number[] = [];
    const interceptorsResponseCleanups: number[] = [];

    allAxiosInstances.forEach((axiosInstance) => {
      if (!backendUrl) {
        return;
      }

      // register axios interceptors here
      const requestInterceptor = axiosInstance.interceptors.request.use(
        async (config) => {
          const token = await getToken({
            template: "Backend"
          });
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          // set the base URL to the organization's backend URL, not
          // the API base URL
          // For direct access, the base path does not include /api
          const currentBaseUrl = config.baseURL?.replaceAll("/api", "");
          config.baseURL = new URL(
            currentBaseUrl ?? "/", //current base url is probably something like /api/auth or /api/db
            backendUrl
          ).toString();
          return config;
        },
        (error) => Promise.reject(error)
      );

      const responseInterceptor = axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
          redirectToLoginPageOnSessionExpiry(error);
          toastError(error.response.data.message);
          return Promise.reject(error);
        }
      );

      // push to the interceptorsRequest object so we can clean up later
      interceptorsRequestCleanups.push(requestInterceptor);
      interceptorsResponseCleanups.push(responseInterceptor);
    });

    // clean up, figure out how to do this properly
    return () => {
      interceptorsRequestCleanups.forEach((cleanup) => {
        allAxiosInstances.forEach((axiosInstance) => {
          axiosInstance.interceptors.request.eject(cleanup);
        });
      });

      interceptorsResponseCleanups.forEach((cleanup) => {
        allAxiosInstances.forEach((axiosInstance) => {
          axiosInstance.interceptors.response.eject(cleanup);
        });
      });
    };
  }, [backendUrl, direct, getToken]);
}
