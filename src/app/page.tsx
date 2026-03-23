import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>Welcome to the Contact Manager</h1>
        <p className={styles.subtitle}>Manage your contacts with ease</p>

        <div className={styles.imageWrap}>
          <img className={styles.image} src="/globe.svg" alt="Contact Manager" />
        </div>

        <p className={styles.cta}>Start managing your contacts now</p>
      </section>
    </div>
  );
}
