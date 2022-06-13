import { createContext, React, useContext } from "react";

export const AuthContext = createContext({
  user: {},
  setUser: () => {}
});

export const AuthProvider = ({ user, children }) => (
  <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
);

export const useUser = () => useContext(AuthContext);
