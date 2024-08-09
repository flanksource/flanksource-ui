import { createContext, useContext } from "react";
import { User } from "../api/types/users";

interface IAuthContext {
  user?: User;
  backendUrl?: string;
  orgSlug?: string;
}

export const AuthContext = createContext<IAuthContext>({});

export const useUser = () => useContext(AuthContext);
