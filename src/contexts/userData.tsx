import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
} from "react";
import { IUser } from "../types";
import { getMe } from "../lib/api";
// import { useNavigate } from "react-router-dom";

export const userDataContext = createContext<{
  data: IUser;
  setData: Dispatch<SetStateAction<IUser>>;
}>({
  data: { _id: "", role: "client", email: "", verified: false },
  setData: () => {},
});

export function useUserDataContext() {
  const { data, setData } = useContext(userDataContext);

  useEffect(() => {
    const runEffects = async () => {
      const { data, status } = await getMe();
      if (status == 200) {
        setData(data);
        return;
      }
      // const userDataJson = localStorage.getItem("user");
      // const userData = userDataJson ? JSON.parse(userDataJson) : null;

      // if (userData) setData(userData);
    };
    runEffects();
  }, [setData]);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(data));
  }, [data]);
  return { data, setData };
}
