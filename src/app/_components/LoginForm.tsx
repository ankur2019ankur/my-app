"use client";

import React, { useActionState, useEffect, useState } from "react";
import styles from "./LoginForm.module.css";
import { login, type LoginState } from "../actions/auth";

const initialState: LoginState = {
  error: null,
};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  useEffect(() => {
    if (!state.error) {
      return;
    }

    setShowErrorPopup(true);

    const timer = window.setTimeout(() => {
      setShowErrorPopup(false);
    }, 10000);

    return () => window.clearTimeout(timer);
  }, [state.error]);

  return (
    <>
      {showErrorPopup && state.error ? (
        <div className={styles.errorPopup} role="alert">
          {state.error}
        </div>
      ) : null}

      <form className={styles.form} action={formAction}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            className={styles.input}
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            className={styles.input}
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <button className={styles.submitButton} type="submit" disabled={isPending}>
          {isPending ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </>
  );
}
