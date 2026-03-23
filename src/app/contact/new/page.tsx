import styles from './page.module.css';
import Link from 'next/link';
import { User } from '@/app/_type/user';
import { getSessionUserEmail } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import { createContact } from '@/app/api/contact';

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

export default async function NewContactPage() {
  const sessionCookie = await getSessionUserEmail();
  const sessionUser = parseSessionUser(sessionCookie);

  if (!sessionUser?.id) {
    redirect('/login');
  }
  const userId = sessionUser.id;

  async function handleCreateContact(formData: FormData) {
    'use server';

    const name = formData.get('name');
    const email = formData.get('email');

    if (typeof name !== 'string' || typeof email !== 'string') {
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      return;
    }

    await createContact({
      name: trimmedName,
      email: trimmedEmail,
      userId,
    });

    redirect('/contact');
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Add Contact</h1>
        <Link href="/contact" className={styles.backLink}>
          Back to Contacts
        </Link>
      </div>

      <form action={handleCreateContact} className={styles.form}>
        <label className={styles.label} htmlFor="name">
          Name
        </label>
        <input className={styles.input} id="name" name="name" type="text" required />

        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input className={styles.input} id="email" name="email" type="email" required />

        <button className={styles.button} type="submit">
          Save Contact
        </button>
      </form>
    </div>
  );
}