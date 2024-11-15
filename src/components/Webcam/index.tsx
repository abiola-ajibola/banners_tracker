import { MutableRefObject, useCallback, useRef } from "react";
import Cam from "react-webcam";
import { Button } from "../Button";
import CameraIcon from "../../assets/camera-svgrepo-com.svg?react";

export function Webcam({
  onCapture,
}: {
  onCapture: (src?: string | null) => void;
}) {
  const webcamRef: MutableRefObject<Cam | undefined> = useRef();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot({width: 300, height: 225});
    onCapture(imageSrc);
  }, [onCapture]);

  return (
    <div>
      <Cam
        ref={webcamRef as MutableRefObject<Cam>}
        disablePictureInPicture
        onUserMedia={console.log}
        onUserMediaError={console.error}
        screenshotFormat="image/png"
        capture="environment"
        screenshotQuality={0.5}
      />
      <Button className="mt-4" onClick={capture}>
        <span>Capture photo</span> {<CameraIcon />}
      </Button>
    </div>
  );
}
