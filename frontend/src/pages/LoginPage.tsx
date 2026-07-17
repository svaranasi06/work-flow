import { useState } from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import type {
  ApiErrorResponse,
  LoginCredentials,
} from "../types/auth.types";

import "../styles/login.css";

const initialFormData: LoginCredentials = {
  emp_id: "",
  password: "",
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] =
    useState<LoginCredentials>(initialFormData);

  const [showPassword, setShowPassword] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const handleInputChange = (
  event: ChangeEvent<HTMLInputElement>
) => {
  const { name, value } = event.target;

  setFormData((currentFormData) => ({
    ...currentFormData,
    [name]:value,
  }));

  if (errorMessage) {
    setErrorMessage("");
  }
};

const handleSubmit = async (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  const employeeId = formData.emp_id.trim();

  if (!employeeId || !formData.password) {
    setErrorMessage(
      "Employee ID and password are required."
    );

    return;
  }

  try {
    setIsSubmitting(true);
    setErrorMessage("");

    await login({
      emp_id: employeeId,
      password: formData.password,
    });

    navigate("/dashboard", {
      replace: true,
    });
  } catch (error) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      setErrorMessage(
        error.response?.data.message ??
          "Unable to login. Please check your credentials."
      );
    } else {
      setErrorMessage(
        "An unexpected error occurred. Please try again."
      );
    }
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <div className="login-brand-content">
          <div className="login-brand-icon">
            <Building2 size={34} />
          </div>

          <p className="login-eyebrow">
            Employee Self-Service Portal
          </p>

          <h1>Enterprise Leave Management</h1>

          <p className="login-brand-description">
            Apply for leave, track approval status,
            manage balances, view holidays, and plan
            availability through one secure portal.
          </p>

          <div className="login-feature-list">
            <div>
              <span>01</span>
              <p>Secure role-based access</p>
            </div>

            <div>
              <span>02</span>
              <p>Transparent approval workflow</p>
            </div>

            <div>
              <span>03</span>
              <p>
                Leave balances and calendar planning
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-card">
          <div className="login-card-header">
            <div className="login-mobile-logo">
              <Building2 size={28} />
            </div>

            <p className="login-card-eyebrow">
              Welcome back
            </p>

            <h2>Sign in to your account</h2>

            <p>
              Enter your employee ID and password to
              continue.
            </p>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="form-group">
              <label htmlFor="emp_id">
                Employee ID
              </label>

              <div className="input-wrapper">
                <UserRound
                  className="input-icon"
                  size={19}
                />

                <input
                  id="emp_id"
                  name="emp_id"
                  type="text"
                  value={formData.emp_id}
                  onChange={handleInputChange}
                  placeholder="Example: ASC001"
                  autoComplete="username"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">
                <LockKeyhole
                  className="input-icon"
                  size={19}
                />

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (currentValue) =>
                        !currentValue
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div
                className="login-error"
                role="alert"
              >
                {errorMessage}
              </div>
            )}

            <button
              className="login-submit-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Signing in..."
                : "Sign In"}
            </button>
          </form>

          <p className="login-support-text">
            Contact HR or your administrator if you
            cannot access your account.
          </p>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;