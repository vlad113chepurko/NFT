"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Skeleton from "../ui/skeleton";
import { vectors } from "@/vectors";

function DashboardSidebarNavigation() {
  const [isLoading, setIsLoading] = useState(true);

  const paths = [
    {
      href: "/dashboard",
      label: "Dashboard",
      vector: <vectors.DashboardVector />,
    },
    {
      href: "/dashboard/cart",
      label: "Cart",
      vector: <vectors.Cart />,
    },
    {
      href: "/dashboard/shop",
      label: "Shop",
      vector: <vectors.Shop />,
    },
    {
      href: "/dashboard/deposit",
      label: "Deposit",
      vector: <vectors.Deposit />,
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <nav className="side-bar__nav">
      <ul>
        {isLoading
          ? paths.map((path) => (
              <li key={path.href} className="side-bar__li">
                <Skeleton className="w-full h-[50px] rounded-[5px]" />
              </li>
            ))
          : paths.map((path) => (
              <li key={path.href} className="side-bar__li">
                <Link href={path.href} className="side-bar__link">
                  {path.vector}
                  <span>{path.label}</span>
                </Link>
              </li>
            ))}
      </ul>
    </nav>
  );
}

export default DashboardSidebarNavigation;
