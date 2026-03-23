"use client";

import React, { useActionState, useEffect, useState } from "react";
import styles from "./RegisterForm.module.css";
import { register, type RegisterState } from "../actions/auth";

const initialState: RegisterState = {
  error: null,
};

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, initialState);
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
          <label className={styles.label} htmlFor="name">
            Full Name
          </label>
          <input
            className={styles.input}
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            required
          />
        </div>

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
            minLength={6}
            required
          />
        </div>

        <button className={styles.submitButton} type="submit" disabled={isPending}>
          {isPending ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </>
  );
}
