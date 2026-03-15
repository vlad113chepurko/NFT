import type { AuthType } from "@/lib/zod/auth";
import { useRouter } from "next/navigation";

interface SignProps {
  data: AuthType;
}

function useAuth(setIsLoading: (value: boolean) => void) {
  const router = useRouter();
  const auth = async ({ data }: SignProps) => {
    try {
      setIsLoading(true);

      const res = await fetch("/api/auth/sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(payload?.error ?? `Auth failed (${res.status})`);
      }

      router.push("/auth/login");
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { auth };
}

export default useAuth;
