import React, { useCallback, useContext, useMemo, useState } from "react";

import { BASE_PATH } from "../utils/HttpUtils";

/**
 * @typedef AuthContextValues
 * @property {string | null} userId
 * @property {(userId: string) => void} setUserId
 */

/** @type {React.Context<AuthContextValues>} */
const AuthContext = React.createContext({
  setUserId: () => {
    throw new Error("AuthContext value is not set");
  },
  userId: null,
});

export const AuthContextProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        setUserId,
        userId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const { userId } = useContext(AuthContext);

  const res = useMemo(
    () => ({
      loggedIn: userId != null,
      userId,
    }),
    [userId],
  );

  return res;
};

export const useRegister = () => {
  const { setUserId } = useContext(AuthContext);

  const register = useCallback(async () => {
    const res = await fetch(`${BASE_PATH}/api/users/me`);
    const data = await res.json();
    setUserId(data.id);
  }, [setUserId]);

  return register;
};
