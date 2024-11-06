import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { useLocationsContext } from "../../contexts/locations";
import { GoogleMap, GoogleMapPin } from "../../components/GoogleMap";
import { locatePosition } from "../../lib/utils";
import { Position } from "../Home";
import { defaultCenter } from "../../constants";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Dialog";
import { Webcam } from "../../components/Webcam";

import Add from "../../assets/plus-svgrepo-com.svg?react";
import RefreshIcon from "../../assets/refresh-ccw-alt-4-svgrepo-com.svg?react";
import SaveIcon from "../../assets/save-svgrepo-com.svg?react";
import { useMap } from "@vis.gl/react-google-maps";

export function AddLocation() {
  const [center, setCenter] = useState<Position>(defaultCenter);
  const [imageSrc, setImageSrc] = useState("");
  const { locations, setLocations } = useLocationsContext();
  const [modalOpen, setModalOpen] = useState(false);
  const map = useMap();

  useEffect(() => {
    const panSetPosition = (position: Position) => {
      map?.panTo(position);
      setCenter(position);
    };
    locatePosition(panSetPosition);
  }, [map]);

  const handleSnapBanner = () => {
    setModalOpen(true);
  };

  const handleAddCurrentLocation = () => {
    const setNewPosition = (position: Position) => {
      const newLocations = [...locations, { id: uuid(), coords: position }];
      setLocations(newLocations);
      setCenter(position);
      map?.panTo(position);
    };
    locatePosition(setNewPosition);
    handleSnapBanner();
  };

  const handleSave = async () => {
    const [typeData, imgData] = imageSrc.split(",");
    const datatype = typeData.split(";")[0].slice(5);
    const binData = atob(imgData)
      .split("")
      .map((char) => char.charCodeAt(0));
    const blob = new Blob([new Uint8Array(binData).buffer], { type: datatype });
    console.log({ blob });
    // upload to cloud storage, then save the url in the location object and save to the cloud db
    // save each location individually, with the registered email

    // In the db, location looks like this:
    /*
    Location {
      id: string;
      coords: {
        lat: number;
        lng: number;
      };
      email: string;
      image_url: string;
    }
    */
  };

  return (
    <>
      <GoogleMap>
        <GoogleMapPin position={center} />
      </GoogleMap>
      <div className="controls">
        <Button
          title="Add my current location"
          type="button"
          onClick={handleAddCurrentLocation}
        >
          <span>Add my location</span>
          <Add color="green" strokeWidth="4" />
        </Button>
        {imageSrc && <img src={imageSrc} alt="banner" />}
        <Modal
          openButton={
            !!imageSrc && (
              <Button
                title="Take picture of banner"
                type="button"
                onClick={handleSnapBanner}
              >
                <span>Retake Picture</span>
                <RefreshIcon color="#c5e1a2" />
              </Button>
            )
          }
          body={
            <Webcam
              onCapture={(src) => {
                setImageSrc(src || "");
                setModalOpen(false);
              }}
            />
          }
          heading="Snap the banner"
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
        <Button title="Save data" type="button" onClick={handleSave}>
          <span>Save</span>
          <SaveIcon color="green" />
        </Button>
      </div>
    </>
  );
}
