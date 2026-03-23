import styles from "./login.module.css";
import LoginForm from "@/app/_components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className={styles.login}>
      <h1>Login Page</h1>
      <LoginForm />
      <div className="mt-4 text-center">
        Do not have an account? 
        <Link href="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
}