import { createContext, Dispatch, SetStateAction, useContext } from "react";

export const userDataContext = createContext<{
  data: { email: string; verified: boolean };
  setData: Dispatch<SetStateAction<{ email: string; verified: boolean }>>;
}>({ data: { email: "", verified: false }, setData: () => {} });

export function useUserDataContext() {
  const { data, setData } = useContext(userDataContext);
  return { data, setData };
}
