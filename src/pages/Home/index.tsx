import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/index";
import { GoogleMap, GoogleMapPin } from "../../components/GoogleMap";
import { locatePosition } from "../../lib/utils";
import { defaultCenter, defaultZoom } from "../../constants";

import LocateMe from "../../assets/my-location-svgrepo-com.svg?react";
import Add from "../../assets/plus-svgrepo-com.svg?react";
import { useMap } from "@vis.gl/react-google-maps";

export type Position = { lat: number; lng: number };

export function Home() {
  const [center, setCenter] = useState(defaultCenter);
  const map = useMap();
  console.log({ map });
  const navigate = useNavigate();
  const pinToCenter = useCallback(
    (center: Position) => {
      map?.panTo(center);
      setCenter(center);
    },
    [map]
  );

  useEffect(() => {
    locatePosition(pinToCenter);
    console.log("EFFECT ");
  }, [pinToCenter]);

  const handleLocateMe = () => {
    locatePosition(pinToCenter);
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
      <GoogleMap
        // onDrag={(ev) => {
        //   const center = ev.map.getCenter()?.toJSON();
        //   if (center) setCenter(center);
        // }}
        defaultZoom={defaultZoom}
        defaultCenter={defaultCenter}
      >
        <GoogleMapPin position={center} />
      </GoogleMap>
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
