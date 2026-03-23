import { User } from "@/app/_type/user";
import { getSessionUserEmail } from "@/app/actions/auth";
import { deleteContact, getContact } from "@/app/api/contact";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "../../new/page.module.css";

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

export default async function DeleteContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const sessionCookie = await getSessionUserEmail();
  const sessionUser = parseSessionUser(sessionCookie);

  if (!sessionUser?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const userId = sessionUser.id;
  const contact = await getContact(id);

  if (contact.userId !== userId) {
    redirect("/contact");
  }

  async function handleDeleteContact() {
    "use server";

    await deleteContact(id);
    redirect("/contact");
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Delete Contact</h1>
        <Link href="/contact" className={styles.backLink}>
          Back to Contacts
        </Link>
      </div>

      <p className={styles.description}>
        Are you sure you want to delete <strong>{contact.name}</strong> (
        {contact.email})?
      </p>

      <form action={handleDeleteContact} className={styles.form}>
        <button className={styles.button} type="submit">
          Confirm Delete
        </button>
      </form>
    </div>
  );
}