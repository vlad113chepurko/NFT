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
      localStorage.removeItem("user");
      router.push("/");
    } catch (e) {
      console.error(e);
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
