import { PropsWithChildren, useState } from "react";
import { userDataContext } from "./userData";
import { IUser } from "../types";

export function UserDataProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState<IUser>({
    email: "",
    _id: "",
    role: "client",
    verified: false,
  });

  return (
    <userDataContext.Provider value={{ data, setData }}>
      {children}
    </userDataContext.Provider>
  );
}
