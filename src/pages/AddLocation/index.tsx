import { useCallback, useEffect, useRef, useState } from "react";
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
import { reverseGeo, saveLocation } from "../../lib/api";
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
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

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
    const { data: geoData, status: geoDataStatus } = await reverseGeo(center);
    console.log({ geoData, geoDataStatus });
    const { data, status } = await saveLocation(
      params.id
        ? {
            _id: params.id,
            coords: center,
            image_url: imageSrc,
            email: user.email,
            address: geoData.results[0]?.formatted_address || "",
            description: descriptionRef.current?.value,
          }
        : {
            coords: center,
            image_url: imageSrc,
            email: user.email,
            address: geoData.results[0]?.formatted_address || "",
            description: descriptionRef.current?.value,
          }
    );

    if (status == 200 || status == 201) {
      const newLocations = params.id
        ? locations.map((loc) =>
            loc._id === params.id
              ? {
                  _id: params.id,
                  coords: center,
                  image_url: imageSrc,
                  address: geoData.results[0]?.formatted_address,
                }
              : loc
          )
        : [
            ...locations,
            {
              _id: data._id,
              coords: center,
              image_url: imageSrc,
              address: geoData.results[0]?.formatted_address,
            },
          ];
      setLocations(newLocations);
      toast({
        description: "Location Saved",
      });
    }
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
        <textarea
          name="description"
          placeholder="Description"
          id="description"
          rows={5}
          ref={descriptionRef}
          className="w-full p-2"
        />
        <Button title="Save data" type="button" onClick={handleSave}>
          <span>Save</span>
          <SaveIcon color="green" />
        </Button>
      </div>
    </>
  );
}
