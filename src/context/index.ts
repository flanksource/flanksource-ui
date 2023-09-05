import { createContext, useContext } from "react";
import { User } from "../api/services/users";

interface IAuthContext {
  user: User;
}

interface IInitialAuthContext {
  user: null;
}

export const AuthContext = createContext<IAuthContext | IInitialAuthContext>({
  user: null
});

export const useUser = () => useContext(AuthContext);
