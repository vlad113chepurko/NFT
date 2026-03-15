import type { AuthType } from "@/lib/zod/auth";
import { useRouter } from "next/navigation";

interface LoginProps {
  data: AuthType;
}

function useLogin(setIsLoading: (value: boolean) => void) {
  const router = useRouter();
  const auth = async ({ data }: LoginProps) => {
    try {
      setIsLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Auth failed");
      }

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { auth };
}

export default useLogin;
