"use client";

import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import styles from "./styles/dashboard.module.css";
import supabase from "@/lib/supabase/client";

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

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      // 1) auth user
      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      const user = authData?.user;

      if (authError || !user) {
        setUserData(null);
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("id, name, email, wallet, avatar")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Failed to load profile from users table:", profileError);
        setUserData(null);
        setLoading(false);
        return;
      }

      setUserData(profile);
      setLoading(false);
    };

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
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
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

          <div className="w-full mt-4 bg-black/40 border border-white/10 rounded-lg p-3">
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
