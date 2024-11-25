import { useEffect, useState } from "react";
import { Card, CardDescription } from "../../components/Card";
import { SearchInput } from "../../components/Input";
import { getUsers } from "../../lib/api";
import { IUser } from "../../types";
import { Pagination } from "../../components/Pagination";

type UserCardProps = {
  userId: string;
  email: string;
  verified: boolean;
  role: string;
};

function UserCard(props: UserCardProps) {
  return (
    <Card className="mb-4 overflow-hidden">
      {props.verified ? (
        <div className={"flex h-2 w-full bg-sky-500"} title={"Verified"} />
      ) : (
        <div className={"flex h-2 w-full bg-red-500"} title={"Unverified"} />
      )}
      <h4>{props.userId}</h4>
      <div>
        <div className="">
          <CardDescription>{props.email}</CardDescription>
          <div>{props.role}</div>
        </div>
      </div>
    </Card>
  );
}

const perPage = 2;

export function AllUsers() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, status } = await getUsers({page: 1, perPage});
      console.log({ data });
      if (status === 200) {
        setCurrentPage(data.currentPage);
        setTotalUsers(data.total);
        setUsers(data.data);
      }
    };
    fetchUsers();
  }, []);
  async function handleSearch(value: string) {
    console.log({ value });
  }
  async function handlePageChange(page: number) {
    const { data, status } = await getUsers({ page, perPage });
    console.log({ data });
    if (status === 200) {
      setCurrentPage(data.currentPage);
      setUsers(data.data);
    }
  }
  return (
    <>
      <SearchInput onSearch={handleSearch} />
      {users.map(({ email, role, _id, verified }) => (
        <UserCard email={email} role={role} userId={_id} verified={verified!} />
      ))}
      <Pagination
        currentPage={currentPage}
        onNext={() => handlePageChange(currentPage + 1)}
        onPrevious={() => handlePageChange(currentPage - 1)}
        onPageClick={handlePageChange}
        pages={Math.ceil(totalUsers / perPage)}
      />
    </>
  );
}
