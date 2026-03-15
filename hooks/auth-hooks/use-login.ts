import type { AuthType } from "@/lib/zod/auth";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";

interface SignProps {
  data: AuthType;
}

export default function useLogin(setIsLoading: (value: boolean) => void) {
  const router = useRouter();

  const auth = async ({ data }: SignProps) => {
    try {
      setIsLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw new Error(error.message);

      router.push("/dashboard");
      return { ok: true };
    } finally {
      setIsLoading(false);
    }
  };

  return { auth };
}
