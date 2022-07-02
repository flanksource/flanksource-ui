import { createContext, useContext } from "react";
import { User } from "../api/services/users";

interface IAuthContext {
  user: User;
  setUser: (user: User) => void;
}

interface IInitialAuthContext {
  user: null;
  setUser: () => void;
}

export const AuthContext = createContext<IAuthContext | IInitialAuthContext>({
  user: null,
  setUser: () => {}
});

export const useUser = () => useContext(AuthContext);
