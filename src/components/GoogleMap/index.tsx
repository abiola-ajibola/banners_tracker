import {
  AdvancedMarker,
  Map,
  MapCameraChangedEvent,
  Pin,
} from "@vis.gl/react-google-maps";
import { Position } from "../../pages/Home";

const defaultZoom = 16;

const { VITE_MAP_ID } = import.meta.env;

export function GoogleMap({ center }: { center: Position }) {
  return (
    <div className="map__wrapper">
      <Map
        mapId={VITE_MAP_ID}
        defaultZoom={defaultZoom}
        defaultCenter={center}
        // center={center}
        onDragend={(ev) => {
          console.log({ c: ev.map.getCenter()?.toJSON() });
        }}
        onCameraChanged={(ev: MapCameraChangedEvent) =>
          console.log(
            "camera changed:",
            ev.detail.center,
            "zoom:",
            ev.detail.zoom
          )
        }
      >
        <AdvancedMarker
          onClick={(ev) => {
            console.log({ ev });
            // handlePreviewLocation
          }}
          position={center}
        >
          <Pin />
        </AdvancedMarker>
      </Map>
    </div>
  );
}
