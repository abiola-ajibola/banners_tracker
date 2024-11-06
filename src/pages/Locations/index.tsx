import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../components/Card";
import EditIcon from "../../assets/edit-svgrepo-com.svg?react";
import DeleteIcon from "../../assets/delete-1487-svgrepo-com.svg?react";
import { Position } from "../Home";
import { buttonVariants } from "../../components/Button/variants";
import { useLocationsContext } from "../../contexts/locations";

function LocationCard({
  street,
  imageUrl,
  id,
  coords,
  onDelete,
}: {
  street?: string;
  imageUrl?: string;
  id: string;
  coords: Position;
  onDelete: (id: string) => void;
}) {
  console.log({ coords });
  return (
    <Card className="gap-4 min-h-20 my-4">
      <CardHeader>{street}</CardHeader>
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

export function AddedLocations() {
  const { locations } = useLocationsContext();
  console.log({ locations });
  const handleDelete = (id: string) => {
    console.log({ delete: id });
  };
  return locations.map((location) => {
    const [[id, coord]] = Object.entries(location);
    console.log({ id, coord });
    return <LocationCard key={id} id={id} coords={coord} onDelete={handleDelete} />;
  });
}
