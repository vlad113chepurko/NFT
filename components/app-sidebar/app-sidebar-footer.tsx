"use client";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";
import { useState } from "react";
import { vectors } from "@/vectors";
export default function SideBarFooter() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  function handleLogout() {
    try {
      setLoading(true);
      fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Logout failed");
          }
          router.push("/auth/login");
        })
        .catch((error) => {
          console.error("Logout error:", error);
        });
    } catch (error) {
      setLoading(false);
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="side-bar__footer">
      <button className="log_out" onClick={handleLogout} type="button">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <vectors.Logout />
            Вихід
          </>
        )}
      </button>
    </div>
  );
}
