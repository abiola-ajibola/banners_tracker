import { useEffect, useState } from "react";
import { Card, CardDescription } from "../../components/Card";
import { SearchInput } from "../../components/Input";
import { getUsers } from "../../lib/api";
import { GetUsersQuery, IUser } from "../../types";
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
const defaultQuery = { page: 1, perPage };

export function AllUsers() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [query, setQuery] = useState<GetUsersQuery>(defaultQuery);
  // This tells if we've made an API request to the server and recieved a response or not
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, status } = await getUsers(defaultQuery);
      console.log({ data });
      if (status === 200) {
        setCurrentPage(data.currentPage);
        setTotalUsers(data.total);
        setUsers(data.data);
        setTouched(true);
      }
    };
    fetchUsers();
  }, []);

  async function handlePageChange(page: number) {
    const { data, status } = await getUsers({ ...query, page });
    console.log({ data });
    if (status === 200) {
      setCurrentPage(data.currentPage);
      setUsers(data.data);
    }
    setQuery((qry) => ({ ...qry, page }));
  }

  async function handleSearch(value: string) {
    console.log({ value });
    const { data, status } = await getUsers({
      ...query,
      page: 1,
      email: value,
    });
    console.log({ data });
    if (status === 200) {
      setCurrentPage(data.currentPage);
      setUsers(data.data);
      setTotalUsers(data.total);
    }
    setQuery((qry) => ({ ...qry, page: 1, email: value }));
  }

  return (
    <>
      <SearchInput onSearch={handleSearch} />
      {users.map(({ email, role, _id, verified }) => (
        <UserCard email={email} role={role} userId={_id} verified={verified!} />
      ))}
      {!users.length && touched ? (
        <div className="text-center my-8">No result</div>
      ) : null}
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
