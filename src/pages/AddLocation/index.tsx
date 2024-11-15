import { useCallback, useEffect, useState } from "react";
// import { v4 as uuid } from "uuid";
import { useLocationsContext } from "../../contexts/locations";
import { GoogleMap, GoogleMapPin } from "../../components/GoogleMap";
import { locatePosition } from "../../lib/utils";
import { defaultCenter } from "../../constants";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Dialog";
import { Webcam } from "../../components/Webcam";

import Add from "../../assets/plus-svgrepo-com.svg?react";
import RefreshIcon from "../../assets/refresh-ccw-alt-4-svgrepo-com.svg?react";
import SaveIcon from "../../assets/save-svgrepo-com.svg?react";
import { useMap } from "@vis.gl/react-google-maps";
import { useParams } from "react-router-dom";
import { Position } from "../../types";
import { useUserDataContext } from "../../contexts/userData";
import { saveLocation } from "../../lib/api";
import { useToast } from "../../hooks/useToast";

export function AddLocation() {
  const [center, setCenter] = useState<Position>(defaultCenter);
  const [imageSrc, setImageSrc] = useState("");
  const { locations, setLocations } = useLocationsContext();
  const [modalOpen, setModalOpen] = useState(false);
  const params = useParams();
  const map = useMap();
  const { data: user } = useUserDataContext();
  const { toast } = useToast();

  const panSetPosition = useCallback(
    (position: Position) => {
      map?.panTo(position);
      setCenter(position);
    },
    [map]
  );

  useEffect(() => {
    if (params.id) {
      const _location = locations.find((l) => l._id === params.id);
      const _center = _location?.coords;
      if (_center) panSetPosition(_center);
      if (_location?.image_url) setImageSrc(_location.image_url);
    }
  }, [locations, panSetPosition, params.id]);

  useEffect(() => {
    locatePosition(panSetPosition);
  }, [panSetPosition]);

  const handleSnapBanner = () => {
    setModalOpen(true);
  };

  const handleAddCurrentLocation = () => {
    const setNewPosition = (position: Position) => {
      setCenter(position);
      map?.panTo(position);
    };
    locatePosition(setNewPosition);
    handleSnapBanner();
  };

  const handleSave = async () => {
    if (!user.email) {
      toast({
        variant: "destructive",
        description: "Please verify your email to save locations",
      });
      return;
    }
    const { data, status } = await saveLocation(
      params.id
        ? {
            _id: params.id,
            coords: center,
            image_url: imageSrc,
            email: user.email,
          }
        : {
            coords: center,
            image_url: imageSrc,
            email: user.email,
          }
    );

    if (status == 200 || status == 201) {
      const newLocations = params.id
        ? locations.map((loc) =>
            loc._id === params.id
              ? { _id: params.id, coords: center, image_url: imageSrc }
              : loc
          )
        : [
            ...locations,
            { _id: data._id, coords: center, image_url: imageSrc },
          ];
      setLocations(newLocations);
    }
    // When image is not a base64 url, there's no need to convert it into a blob for uploading, we can just save url as is.
    // commented because, images will now be stored in the DB as base64 data urls
    // if (imageSrc.includes("data")) {
    //   const [typeData, imgData] = imageSrc.split(",");
    //   const datatype = typeData.split(";")[0].slice(5);
    //   const binData = atob(imgData)
    //     .split("")
    //     .map((char) => char.charCodeAt(0));
    //   const blob = new Blob([new Uint8Array(binData).buffer], {
    //     type: datatype,
    //   });
    //   console.log({ blob });
    // }

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
