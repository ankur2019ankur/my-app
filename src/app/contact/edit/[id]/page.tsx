import { User } from '@/app/_type/user';
import { getSessionUserEmail } from '@/app/actions/auth';
import { getContact, updateContact } from '@/app/api/contact';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import styles from '../../new/page.module.css';

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


export default async function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const sessionCookie = await getSessionUserEmail();
  const sessionUser = parseSessionUser(sessionCookie);

  if (!sessionUser?.id) {
    redirect('/login');
  }

  const { id } = await params;
  const userId = sessionUser.id;
  const contact = await getContact(id);

  if (contact.userId !== userId) {
    redirect('/contact');
  }

  async function handleUpdateContact(formData: FormData) {
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

    await updateContact(id, {
      name: trimmedName,
      email: trimmedEmail,
      userId,
    });

    redirect('/contact');
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Edit Contact</h1>
        <Link href="/contact" className={styles.backLink}>
          Back to Contacts
        </Link>
      </div>

      <form action={handleUpdateContact} className={styles.form}>
        <label className={styles.label} htmlFor="name">
          Name
        </label>
        <input
          className={styles.input}
          id="name"
          name="name"
          type="text"
          defaultValue={contact.name}
          required
        />

        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          className={styles.input}
          id="email"
          name="email"
          type="email"
          defaultValue={contact.email}
          required
        />

        <button className={styles.button} type="submit">
          Update Contact
        </button>
      </form>
    </div>
  );
}