import styles from "./styles/dashboard.module.css";
import DashboardSidebar from "@/components/app-sidebar/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className={styles.main}>
      <DashboardSidebar />
      {children}
    </main>
  );
}
