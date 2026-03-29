import { IUser } from "@/types/user.types";

interface Props {
  setUserData: React.Dispatch<React.SetStateAction<IUser | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function useGetUser({ setUserData, setLoading }: Props) {
  const fetchUserData = async () => {
    try {
      setLoading(true);

      const stored = localStorage.getItem("user");

      if (!stored) {
        setUserData(null);
        return;
      }

      const user = JSON.parse(stored);
      setUserData(user);
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
