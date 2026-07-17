import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./components/AppLayout";

import { useAuth } from "./context/AuthContext";

import CalendarPage from "./pages/CalendarPage";
import DashboardPage from "./pages/DashboardPage";
import HrInboxPage from "./pages/HrInboxPage";
//import LeavePoliciesPage from "./pages/LeavePoliciesPage";
import LoginPage from "./pages/LoginPage";
import ManagerInboxPage from "./pages/ManagerInboxPage";
import MyLeavesPage from "./pages/MyLeavesPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import PublicHolidaysPage from "./pages/PublicHolidaysPage";

import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
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

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate
              to="/dashboard"
              replace
            />
          ) : (
            <LoginPage />
          )
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route
            path="dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="my-leaves"
            element={<MyLeavesPage />}
          />

          <Route
            path="calendar"
            element={<CalendarPage />}
          />

          <Route
            path="manager/inbox"
            element={<ManagerInboxPage />}
          />

          <Route
            path="hr/inbox"
            element={<HrInboxPage />}
          />

          <Route
            path="notifications"
            element={<NotificationsPage />}
          />

        <Route
  path="public-holidays"
  element={<PublicHolidaysPage />}
/>

          <Route
            path="profile"
            element={<ProfilePage />}
          />
        </Route>
      </Route>

      <Route
        path="/"
        element={
          <Navigate
            to={
              isAuthenticated
                ? "/dashboard"
                : "/login"
            }
            replace
          />
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to={
              isAuthenticated
                ? "/dashboard"
                : "/login"
            }
            replace
          />
        }
      />
    </Routes>
  );
};

export default App;