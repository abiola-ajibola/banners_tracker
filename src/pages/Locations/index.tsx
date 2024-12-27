import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../../components/Card";
import EditIcon from "../../assets/edit-svgrepo-com.svg?react";
import DeleteIcon from "../../assets/delete-1487-svgrepo-com.svg?react";
import { buttonVariants } from "../../components/Button/variants";
import { useLocationsContext } from "../../contexts/locations";
import { AllLocationsQuery, MapLocation, Position } from "../../types";
import { useEffect, useMemo, useState } from "react";
import { getAllLocations } from "../../lib/api";
import { SearchInput } from "../../components/Input";
import { Pagination } from "../../components/Pagination";

function LocationCard({
  street,
  imageUrl,
  id,
  coords,
  description,
  onDelete,
}: {
  street?: string;
  imageUrl?: string;
  id: string;
  coords: Position;
  description?: string;
  onDelete: (id: string) => void;
}) {
  console.log({ coords });
  return (
    <Card className="gap-4 min-h-20 my-4">
      <CardHeader>{street}</CardHeader>
      <CardDescription className="my-3">{description}</CardDescription>
      <CardContent>
        <img width={"100%"} src={imageUrl} alt={"banner " + street} />
      </CardContent>
      <CardFooter className="flex justify-between gap-4">
        <Link
          className={buttonVariants({ variant: "default" }) + " basis-6/12"}
          to={"/location/" + id}
        >
          <span>Edit</span>
          <EditIcon />
        </Link>
        <button
          className={buttonVariants({ variant: "destructive" }) + " basis-6/12"}
          onClick={() => onDelete(id)}
        >
          <span>Delete</span> <DeleteIcon />
        </button>
      </CardFooter>
    </Card>
  );
}

const perPage = 2;
const defaultQuery = { page: 1, perPage };

export function AddedLocations({ isAdmin = false }: { isAdmin?: boolean }) {
  const { locations } = useLocationsContext(isAdmin);
  const [allLocations, setAllLocations] = useState<MapLocation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLocations, setTotalLocations] = useState(0);
  const [query, setQuery] = useState<AllLocationsQuery>(defaultQuery);
  // This tells if we've made an API request to the server and recieved a response or not
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      const { data, status } = await getAllLocations(defaultQuery);
      console.log({ data });
      if (status === 200) {
        setCurrentPage(data.currentPage);
        setTotalLocations(data.total);
        setAllLocations(data.data);
        setTouched(true);
      }
    };
    if (isAdmin) {
      fetchLocations();
    }
  }, [isAdmin]);

  const handleDelete = (id: string) => {
    console.log({ delete: id });
  };

  async function handlePageChange(page: number) {
    const { data, status } = await getAllLocations({ ...query, page });
    console.log({ data });
    if (status === 200) {
      setCurrentPage(data.currentPage);
      setAllLocations(data.data);
    }
    setQuery((qry) => ({ ...qry, page }));
  }

  async function handleSearch(
    value: string,
    type: "email" | "address" = "email"
  ) {
    console.log({ value });
    const { data, status } = await getAllLocations({
      ...query,
      page: 1,
      [type === "address" ? "address" : "userEmail"]: value,
    });
    console.log({ data });
    if (status === 200) {
      setCurrentPage(data.currentPage);
      setAllLocations(data.data);
      setTotalLocations(data.total);
    }
    setQuery((qry) => ({ ...qry, page: 1, email: value }));
  }

  const results = useMemo(
    () => (isAdmin ? allLocations : locations),
    [allLocations, isAdmin, locations]
  );

  console.log({ results, allLocations, locations });
  return (
    <>
      <SearchInput
        inputProps={{ placeholder: "Search by email", type: "search" }}
        onSearch={handleSearch}
      />
      <SearchInput
        inputProps={{ placeholder: "Search by address", type: "search" }}
        onSearch={(v) => handleSearch(v, "address")}
      />
      {results.map((location) => {
        const { _id: id, coords, image_url, description, address } = location;
        console.log({ id, coords });
        return (
          <LocationCard
            key={id}
            id={id || ""}
            coords={coords}
            imageUrl={image_url}
            street={address}
            onDelete={handleDelete}
            description={description}
          />
        );
      })}
      {!results.length && touched ? (
        <div className="text-center my-8">No result</div>
      ) : null}
      <Pagination
        currentPage={currentPage}
        onNext={() => handlePageChange(currentPage + 1)}
        onPrevious={() => handlePageChange(currentPage - 1)}
        onPageClick={handlePageChange}
        pages={Math.ceil(totalLocations / perPage)}
      />
    </>
  );
}
