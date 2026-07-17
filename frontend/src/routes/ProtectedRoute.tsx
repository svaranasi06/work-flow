import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return (
      <main className="auth-loading-screen">
        <div className="auth-loading-spinner" />

        <p>Checking your session...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;