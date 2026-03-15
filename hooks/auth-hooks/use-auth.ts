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

      if (!res.ok) {
        throw new Error("Auth failed");
      }

      router.push('/auth/login');
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
