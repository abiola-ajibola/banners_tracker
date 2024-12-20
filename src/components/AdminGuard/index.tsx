import { useUserDataContext } from "../../contexts/userData";
import { Outlet } from "react-router-dom";

export function AdminGuard() {
  const { data: userData } = useUserDataContext();
  return userData.role !== "admin" ? (
    <>
      <h2 className="text-red-400">Unauthorized!</h2>
      <p className="font-semibold">You must be an admin to access this page</p>
    </>
  ) : (
    <Outlet />
  );
}
