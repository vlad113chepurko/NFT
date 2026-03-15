"use client";
import useGetUser from "@/hooks/use-get-user";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import styles from "./styles/dashboard.module.css";

interface UserRow {
  id: string;
  name: string | null;
  email: string | null;
  wallet: string | null;
  avatar: string | null;
}

export default function Dashboard() {
  const [userData, setUserData] = useState<UserRow | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchUserData = useGetUser({ setUserData, setLoading });

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading || !userData) {
    return (
      <div className={styles.dashboard}>
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.profileCard}>
        <div className="flex flex-col items-center gap-4">
          <img
            src={userData.avatar ?? "https://i.pravatar.cc/150?img=12"}
            className="w-24 h-24 rounded-full border-2 border-purple-500 shadow-lg"
            alt="avatar"
          />
          <h1 className="text-2xl font-bold tracking-wide">
            {userData.name || "Anonymous"}
          </h1>
          <p className="text-gray-400 text-sm">{userData.email}</p>

          <div className={styles.walletInfo}>
            <p className="text-xs text-gray-400">Wallet</p>
            <p className="font-mono text-sm text-purple-400">
              {userData.wallet ?? "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
