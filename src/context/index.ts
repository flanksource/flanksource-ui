import { createContext, useContext } from "react";
import { User } from "../api/types/users";

export type Permission = {
  subject: string;
  object: string;
  deny?: boolean;
  action: string;
};

interface IAuthContext {
  user?: User;
  backendUrl?: string;
  orgSlug?: string;
  roles?: string[];
  permissions?: Permission[];
}

export const AuthContext = createContext<IAuthContext>({});

export const useUser = () => useContext(AuthContext);
