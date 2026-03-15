"use client";
import "./app-sidebar.css";
import SideBarFooter from "./app-sidebar-footer";
import DashboardSidebarNavigation from "./app-sidebar-nav";

export default function DashboardSidebar() {

  return (
    <aside className="dashboard-sidebar">
      <DashboardSidebarNavigation />
      <SideBarFooter />
    </aside>
  );
}
