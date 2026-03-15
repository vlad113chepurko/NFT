"use client";
import "./app-sidebar.css";
import { vectors } from "@/vectors/index";
import { useRouter } from "next/navigation";
import DashboardSidebarNavigation from "./app-sidebar-nav";

export default function DashboardSidebar() {
  const router = useRouter();
  return (
    <aside className="dashboard-sidebar">
      <div>
        <div className="dashboard-sidebar__header">
          <button
            className="dashboard-sidebar__logo"
            onClick={() => router.push("/")}
            type="button"
          >
            <vectors.Close />
          </button>
        </div>
        <DashboardSidebarNavigation />
      </div>
    </aside>
  );
}
