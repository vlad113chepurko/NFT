import supabase from "@/lib/supabase/client";
import { Keypair } from "@solana/web3.js";

interface UserRow {
  id: string;
  name: string | null;
  email: string | null;
  wallet: string | null;
  avatar: string | null;
}

interface Props {
  setUserData: React.Dispatch<React.SetStateAction<UserRow | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function useGetUser({ setUserData, setLoading }: Props) {
  const fetchUserData = async () => {
    try {
      setLoading(true);

      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      const user = authData?.user;

      if (authError || !user) {
        console.error("auth.getUser error:", authError);
        setUserData(null);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("id, name, email, wallet, avatar")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("users select error:", profileError);
        setUserData(null);
        return;
      }

      if (!profile.wallet) {
        const kp = Keypair.generate();
        const walletAddress = kp.publicKey.toBase58();

        const { error: updateError } = await supabase
          .from("users")
          .update({ wallet: walletAddress })
          .eq("id", user.id);

        if (updateError) {
          console.error("wallet update failed:", updateError);
        } else {
          profile.wallet = walletAddress;
        }
      }

      setUserData(profile);
    } catch (error) {
      console.error("Unexpected error:", error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  return fetchUserData;
}

export default useGetUser;
