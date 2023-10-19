import { createContext, useContext } from "react";
import { User } from "../api/services/users";

interface IAuthContext {
  user: User;
  backendUrl?: string;
}

interface IInitialAuthContext {
  user: null;
  backendUrl?: string;
}

export const AuthContext = createContext<IAuthContext | IInitialAuthContext>({
  user: null
});

export const useUser = () => useContext(AuthContext);
