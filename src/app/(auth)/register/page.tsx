import Link from "next/link";
import RegisterForm from "@/app/_components/RegisterForm";
import styles from "./register.module.css";
import { User } from "@/app/_type/user";
import { getSessionUserEmail } from "@/app/actions/auth";
import { redirect } from "next/navigation";

function parseSessionUser(cookieValue: string | null): User | null {
    if (!cookieValue) {
      return null;
    }
  
    try {
      return JSON.parse(cookieValue) as User;
    } catch {
      return null;
    }
  }
  

export default async function RegisterPage() {
  const sessionCookie = await getSessionUserEmail();
  const sessionUser = parseSessionUser(sessionCookie);

  if (sessionUser?.id) {
    redirect('/contact');
  }
  return (
    <div className={styles.register}>
      <h1 className={styles.title}>Create Your Account</h1>
      <p className={styles.subtitle}>Register to start using Contact Manager.</p>
      <RegisterForm />
      <p className={styles.helperText}>
        Already have an account?{" "}
        <Link href="/login" className={styles.link}>
          Login
        </Link>
      </p>
    </div>
  );
}