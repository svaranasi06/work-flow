import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { ReactNode } from "react";

import {
  loginUser,
  logoutUser,
  refreshUserSession,
} from "../services/auth.service";

import {
  clearAccessToken,
  setAccessToken,
} from "../services/token.service";

import type {
  AuthUser,
  LoginCredentials,
} from "../types/auth.types";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuthentication = useCallback(() => {
    clearAccessToken();
    setUser(null);
  }, []);

  const restoreSession = useCallback(async () => {
    try {
      const response = await refreshUserSession();

      setAccessToken(response.data.accessToken);
      setUser(response.data.user);
    } catch {
      clearAuthentication();
    } finally {
      setIsLoading(false);
    }
  }, [clearAuthentication]);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    const handleSessionExpired = () => {
      clearAuthentication();
      setIsLoading(false);
    };

    window.addEventListener(
      "auth:session-expired",
      handleSessionExpired
    );

    return () => {
      window.removeEventListener(
        "auth:session-expired",
        handleSessionExpired
      );
    };
  }, [clearAuthentication]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const response = await loginUser(credentials);

      setAccessToken(response.data.accessToken);
      setUser(response.data.user);
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      clearAuthentication();
    }
  }, [clearAuthentication]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
};