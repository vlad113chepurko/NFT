import { IUser } from "@/types/user.types";
import supabase from "@/lib/supabase/client";
interface Props {
  setUserData: React.Dispatch<React.SetStateAction<IUser | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function useGetUser({ setUserData, setLoading }: Props) {
  const fetchUserData = async () => {
    const cached = localStorage.getItem("user");

    if (cached) {
      setUserData(JSON.parse(cached));
    }

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", JSON.parse(cached || "{}")?.id)
      .single();

    if (data) {
      setUserData(data);
      localStorage.setItem("user", JSON.stringify(data));
    }

    setLoading(false);
  };
  return fetchUserData;
}
export default useGetUser;
