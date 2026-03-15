"use client";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";

function DashboardSidebarNavigation() {
  const [isLoading, setIsLoading] = useState(true);

  const paths = [
    {
      href: `/dashboard`,
      hrefToCheck: "/dashboard",
      label: "Панель керування",
    },
    {
      href: "/library",
      hrefToCheck: "/library",
      label: "Бібліотека",
    },
    {
      href: "/notifications",
      hrefToCheck: "/notifications",
      label: "Повідомлення",
    },
    {
      href: "/metrics",
      hrefToCheck: "/metrics",
      label: "Метрики",
    },
    {
      href: "/finances",
      hrefToCheck: "/finances",
      label: "Фінанси",
    },
    {
      href: "/settings",
      hrefToCheck: "/settings",
      label: "Налаштування",
    },
  ];

  return (
    <nav className="side-bar__nav">
      <ul>
        {isLoading ? (
          <>
            {paths.map((path) => (
              <li key={path.href} className={`side-bar__li`}>
                <Skeleton className="w-full h-10 rounded-[5px]" />
              </li>
            ))}
          </>
        ) : (
          <>
            {paths.map((path) => (
              <li key={path.href} className={`side-bar__li`}>
                <Link href={path.href}>
                  <span>{path.label}</span>
                </Link>
              </li>
            ))}
          </>
        )}
      </ul>
    </nav>
  );
}

export default DashboardSidebarNavigation;
