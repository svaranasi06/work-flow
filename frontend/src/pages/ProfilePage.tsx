import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  AlertCircle,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Mail,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { getMyProfile } from "../services/profile.service";

import type {
  ApiErrorResponse,
} from "../types/auth.types";

import type {
  ProfileData,
} from "../types/profile.types";

import "../styles/profile.css";

interface ProfileBalanceCard {
  label: string;
  value: number;
  className: string;
}

const formatAccountDate = (
  dateValue: string
): string => {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
  }).format(new Date(dateValue));
};

const ProfilePage = () => {
  const navigate = useNavigate();

  const [profile, setProfile] =
    useState<ProfileData | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const loadProfile =
    useCallback(async (): Promise<void> => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response =
          await getMyProfile();

        setProfile(response.data);
      } catch (error) {
        if (
          axios.isAxiosError<ApiErrorResponse>(
            error
          )
        ) {
          setErrorMessage(
            error.response?.data.message ??
              "Unable to load profile information."
          );
        } else {
          setErrorMessage(
            "An unexpected error occurred while loading your profile."
          );
        }
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const balanceCards =
    useMemo<ProfileBalanceCard[]>(() => {
      return [
        {
          label: "Annual Leave",
          value:
            profile?.leaveBalance
              ?.annual_leave_balance ?? 0,
          className: "annual",
        },
        {
          label: "Paternity Leave",
          value:
            profile?.leaveBalance
              ?.paternity_leave_balance ?? 0,
          className: "paternity",
        },
        {
          label: "Bereavement Leave",
          value:
            profile?.leaveBalance
              ?.bereavement_leave_balance ?? 0,
          className: "bereavement",
        },
        {
          label: "Comp Off",
          value:
            profile?.leaveBalance
              ?.compoff_leave_balance ?? 0,
          className: "compoff",
        },
      ];
    }, [profile]);

  if (isLoading) {
    return (
      <section className="profile-state">
        <div className="profile-loader" />

        <h1>Loading profile</h1>

        <p>
          Please wait while your employee
          information is loaded.
        </p>
      </section>
    );
  }

  if (errorMessage || !profile) {
    return (
      <section className="profile-state">
        <AlertCircle
          className="profile-error-icon"
          size={42}
        />

        <h1>Unable to load profile</h1>

        <p>
          {errorMessage ||
            "Profile information is unavailable."}
        </p>
      </section>
    );
  }

  const profileInitial =
    profile.name.charAt(0).toUpperCase();

  return (
    <section className="profile-page">
      <header className="profile-page-header">
        <div>
          <p className="page-eyebrow">
            Employee Account
          </p>

          <h1>My Profile</h1>

          <p>
            Review your employee information,
            reporting structure, and current leave
            balances.
          </p>
        </div>
      </header>
      <article className="profile-identity-card">
        <div className="profile-large-avatar">
          {profileInitial}
        </div>
        <div className="profile-identity-content">
          <div className="profile-name-row">
            <div>
              <h2>{profile.name}</h2>

              <p>
                {profile.emp_id}
                {" · "}
                {profile.role}
              </p>
            </div>
            <span
              className={
                profile.is_active
                  ? "profile-status profile-status-active"
                  : "profile-status profile-status-inactive"
              }
            >
              <BadgeCheck size={15} />

              {profile.is_active
                ? "Active Account"
                : "Inactive Account"}
            </span>
          </div>

          <div className="profile-contact-summary">
            <span>
              <Mail size={16} />

              {profile.email}
            </span>

            <span>
              <Building2 size={16} />

              {profile.department?.name ??
                "Department not assigned"}
            </span>

            <span>
              <BriefcaseBusiness size={16} />

              {profile.role}
            </span>
          </div>
        </div>
      </article>

      <div className="profile-content-grid">
        <section className="profile-information-card">
          <header className="profile-card-heading">
            <div className="profile-heading-icon">
              <UserRound size={20} />
            </div>

            <div>
              <h2>Employee Information</h2>

              <p>
                Personal employment and account
                details.
              </p>
            </div>
          </header>

          <div className="profile-detail-list">
            <div className="profile-detail-item">
              <span>Employee Name</span>

              <strong>{profile.name}</strong>
            </div>

            <div className="profile-detail-item">
              <span>Employee ID</span>

              <strong>{profile.emp_id}</strong>
            </div>

            <div className="profile-detail-item">
              <span>Email Address</span>

              <strong>{profile.email}</strong>
            </div>

            <div className="profile-detail-item">
              <span>Role</span>

              <strong>{profile.role}</strong>
            </div>

            <div className="profile-detail-item">
              <span>Account Created</span>

              <strong>
                {formatAccountDate(
                  profile.created_at
                )}
              </strong>
            </div>

            <div className="profile-detail-item">
              <span>Last Updated</span>

              <strong>
                {formatAccountDate(
                  profile.updated_at
                )}
              </strong>
            </div>
          </div>
        </section>

        <section className="profile-information-card">
          <header className="profile-card-heading">
            <div className="profile-heading-icon">
              <UsersRound size={20} />
            </div>

            <div>
              <h2>Organization</h2>

              <p>
                Department and reporting information.
              </p>
            </div>
          </header>

          <div className="profile-organization-section">
            <div className="profile-organization-block">
              <div className="profile-organization-icon">
                <Building2 size={21} />
              </div>

              <div>
                <span>Department</span>

                <strong>
                  {profile.department?.name ??
                    "Not assigned"}
                </strong>

                <p>
                  {profile.department?.description ??
                    "No department description is available."}
                </p>
              </div>
            </div>

            <div className="profile-organization-block">
              <div className="profile-organization-icon">
                <ShieldCheck size={21} />
              </div>

              <div>
                <span>Reporting Manager</span>

                {profile.manager ? (
                  <>
                    <strong>
                      {profile.manager.name}
                    </strong>

                    <p>
                      {profile.manager.emp_id}
                      {" · "}
                      {profile.manager.email}
                    </p>
                  </>
                ) : (
                  <>
                    <strong>
                      Not assigned
                    </strong>

                    <p>
                      No reporting Manager is
                      assigned to this role.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="profile-balance-section">
        <div className="profile-section-heading">
          <div>
            <h2>Current Leave Balance</h2>

            <p>
              Compact overview of your available
              personal leave balance.
            </p>
          </div>

          <button
            type="button"
            className="profile-my-leaves-button"
            onClick={() => {
              navigate("/my-leaves");
            }}
          >
            <CalendarDays size={17} />

            View My Leaves
          </button>
        </div>

        <div className="profile-balance-grid">
          {balanceCards.map((balance) => (
            <article
              key={balance.label}
              className={`profile-balance-card profile-balance-card-${balance.className}`}
            >
              <span>{balance.label}</span>

              <strong>{balance.value}</strong>

              <p>Available days</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
};

export default ProfilePage;