import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { useLocationsContext } from "../../contexts/locations";
import { GoogleMap } from "../../components/GoogleMap";
import { locatePosition } from "../../lib/utils";
import { Position } from "../Home";
import { defaultCenter } from "../../constants";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Dialog";
import { Webcam } from "../../components/Webcam";

import Add from "../../assets/plus-svgrepo-com.svg?react";
import CameraIcon from "../../assets/camera-svgrepo-com.svg?react";
import RefreshIcon from "../../assets/refresh-ccw-alt-4-svgrepo-com.svg?react";
import SaveIcon from "../../assets/save-svgrepo-com.svg?react";

export function AddLocation() {
  const [center, setCenter] = useState<Position>(defaultCenter);
  const [imageSrc, setImageSrc] = useState("");
  const { locations, setLocations } = useLocationsContext();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    locatePosition(setCenter);
  }, []);

  const handleAddCurrentLocation = () => {
    const setNewPosition = (position: Position) => {
      const newLocations = [...locations, { [uuid()]: position }];
      setLocations(newLocations);
      setCenter(position);
    };
    locatePosition(setNewPosition);
  };

  const handleSnapBanner = () => {
    setModalOpen(true);
  };

  return (
    <>
      <GoogleMap center={center} />
      <div className="controls">
        <Button
          title="Add current location"
          type="button"
          onClick={handleAddCurrentLocation}
        >
          <span>Add current location</span>
          <Add color="green" strokeWidth="4" />
        </Button>
        {imageSrc && <img src={imageSrc} alt="banner" />}
        <Modal
          openButton={
            <Button
              title="Take picture of banner"
              type="button"
              onClick={handleSnapBanner}
            >
              {imageSrc ? (
                <>
                  <span>Retake Picture</span>
                  <RefreshIcon color="#c5e1a2" />
                </>
              ) : (
                <>
                  <span>Snap the banner</span>
                  <CameraIcon />
                </>
              )}
            </Button>
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
        <Button
          title="Save data"
          type="button"
          onClick={handleAddCurrentLocation}
        >
          <span>Save</span>
          <SaveIcon color="green" />
        </Button>
      </div>
    </>
  );
}
