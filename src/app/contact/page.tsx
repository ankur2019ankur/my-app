import { redirect } from 'next/navigation';
import { getSessionUserEmail } from '@/app/actions/auth';
import { getContacts } from '@/app/api/contact';
import type { User } from '@/app/_type/user';
import styles from './page.module.css';
import Link from 'next/link';

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

export default async function contactPage() {
  const sessionCookie = await getSessionUserEmail();
  const sessionUser = parseSessionUser(sessionCookie);

  if (!sessionUser?.id) {
    redirect('/login');
  }

  const contacts = await getContacts();

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Contacts</h1>
        <Link href="/contact/new" className={styles.button}>
          Add Contact
        </Link>
      </div>

      {contacts.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.empty}>no contact found</p>
      )}
    </div>
  );
}