import {
  Bell,
  CalendarDays,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  ScrollText,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import type { UserRole } from "../types/auth.types";

import "../styles/layout.css";

interface NavigationItem {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
  allowedRoles: UserRole[];
}

const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    allowedRoles: [
      "ASSOCIATE",
      "MANAGER",
      "HR",
      "ADMIN",
    ],
  },
  {
    label: "My Leaves",
    path: "/my-leaves",
    icon: ScrollText,
    allowedRoles: [
      "ASSOCIATE",
      "MANAGER",
      "HR",
      "ADMIN",
    ],
  },
  {
    label: "Calendar",
    path: "/calendar",
    icon: CalendarDays,
    allowedRoles: [
      "ASSOCIATE",
      "MANAGER",
      "HR",
      "ADMIN",
    ],
  },
  {
    label: "Manager Inbox",
    path: "/manager/inbox",
    icon: ClipboardCheck,
    allowedRoles: ["MANAGER"],
  },
  {
    label: "HR Inbox",
    path: "/hr/inbox",
    icon: ClipboardCheck,
    allowedRoles: ["HR"],
  },
  {
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
    allowedRoles: [
      "ASSOCIATE",
      "MANAGER",
      "HR",
      "ADMIN",
    ],
  },

 {
  label: "Public Holidays",
  path: "/public-holidays",
  icon: CalendarDays,
  allowedRoles: [
    "ASSOCIATE",
    "MANAGER",
    "HR",
  ],
},
  {
    label: "Profile",
    path: "/profile",
    icon: UserRound,
    allowedRoles: [
      "ASSOCIATE",
      "MANAGER",
      "HR",
      "ADMIN",
    ],
  },
];

const AppLayout = () => {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const visibleNavigationItems =
    navigationItems.filter((item) =>
      user
        ? item.allowedRoles.includes(user.role)
        : false
    );

  const handleLogout = async () => {
    await logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <ShieldCheck size={25} />
          </div>

          <div>
            <p>Enterprise</p>
            <h1>Leave Portal</h1>
          </div>
        </div>

        <nav
          className="sidebar-navigation"
          aria-label="Main navigation"
        >
          {visibleNavigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "sidebar-link sidebar-link-active"
                    : "sidebar-link"
                }
              >
                <Icon size={19} />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {user?.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="sidebar-user-details">
              <strong>{user?.name}</strong>

              <span>
                {user?.role}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={18} />

            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-header">
          <div>
            <p className="app-header-eyebrow">
              Leave Management System
            </p>

            <h2>
              Welcome back, {user?.name}
            </h2>
          </div>

          <div className="app-header-actions">
            <NavLink
              to="/notifications"
              className="header-icon-button"
              aria-label="View notifications"
            >
              <Bell size={20} />
            </NavLink>

            <NavLink
              to="/profile"
              className="header-profile-link"
            >
              <div className="header-profile-avatar">
                {user?.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <strong>{user?.name}</strong>

                <span>
                  {user?.department?.name ??
                    "Department not assigned"}
                </span>
              </div>
            </NavLink>
          </div>
        </header>

        <div className="app-page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;