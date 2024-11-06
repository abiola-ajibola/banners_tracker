import { PropsWithChildren, useState } from "react";
import { userDataContext } from "./userData";

export function UserDataProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState({ email: "", verified: false });

  return (
    <userDataContext.Provider value={{ data, setData }}>
      {children}
    </userDataContext.Provider>
  );
}
