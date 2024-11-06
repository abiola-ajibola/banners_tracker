import {
  AdvancedMarker,
  AdvancedMarkerProps,
  Map,
  MapProps,
  Pin,
} from "@vis.gl/react-google-maps";
import { PropsWithChildren } from "react";
import { defaultCenter, defaultZoom } from "../../constants";

const { VITE_MAP_ID } = import.meta.env;

export function GoogleMapPin(props: AdvancedMarkerProps) {
  return (
    <AdvancedMarker
      onClick={(ev) => {
        console.log({ ev });
        // handlePreviewLocation
      }}
      {...props}
    >
      <Pin />
    </AdvancedMarker>
  );
}

export function GoogleMap(props: PropsWithChildren<MapProps>) {
  return (
    <div className="map__wrapper">
      <Map
        mapId={VITE_MAP_ID}
        defaultCenter={props.defaultCenter || defaultCenter}
        defaultZoom={props.defaultZoom || defaultZoom}
        children={props.children || <GoogleMapPin position={defaultCenter} />}
        {...props}
      />
    </div>
  );
}
