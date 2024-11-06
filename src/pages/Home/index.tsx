import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/index";
import { GoogleMap } from "../../components/GoogleMap";
import { locatePosition } from "../../lib/utils";
import { defaultCenter } from "../../constants";

import LocateMe from "../../assets/my-location-svgrepo-com.svg?react";
import Add from "../../assets/plus-svgrepo-com.svg?react";

export type Position = { lat: number; lng: number };

export function Home() {
  const [center, setCenter] = useState(defaultCenter);

  const navigate = useNavigate();

  useEffect(() => {
    locatePosition(setCenter);
    console.log("EFFECT ")
  }, []);

  const handleLocateMe = () => {
    locatePosition(setCenter);
  };

  // const handlePreviewLocation preview location by UUID
  // const handleEditLocation // edit location by UUID
  const handleAddNewLocation = () => {
    const setNewPosition = (position: Position) => {
      setCenter(position);
      navigate("/location", { viewTransition: true });
    };
    locatePosition(setNewPosition);
  };

  return (
    <>
      <GoogleMap center={center} />
      <div className="controls">
        <Button
          title="Add location"
          type="button"
          onClick={handleAddNewLocation}
        >
          <span>Add new location</span>
          <Add color="green" strokeWidth="4" />
        </Button>
        <Button
          title="Locate my position"
          type="button"
          onClick={handleLocateMe}
        >
          <span>Locate Me</span>
          <LocateMe />
        </Button>
      </div>
    </>
  );
}
