import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
} from "react";
import { IUser } from "../types";

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
    localStorage.setItem("user", JSON.stringify(data));
  }, [data]);
  return { data, setData };
}
