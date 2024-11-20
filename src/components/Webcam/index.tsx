import {
  // MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Cam from "react-webcam";
import { Button } from "../Button";
import CameraIcon from "../../assets/camera-svgrepo-com.svg?react";
import { SelectUI } from "../Select";
import { useToast } from "../../hooks/useToast";

export function Webcam({
  onCapture,
}: {
  onCapture: (src?: string | null) => void;
}) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const refsMap = new Map<string, Cam>();
  const webcamRef = useRef(refsMap);
  const { toast } = useToast();

  console.log({ devices, deviceId });
  useEffect(() => {
    console.log({ navigator });
    if (!navigator.mediaDevices.enumerateDevices) {
      toast({ variant: "destructive", description: "Camera not allowed on your device!" });
      return;
    }
    navigator.mediaDevices.enumerateDevices?.().then((devicesInfo) => {
      const filteredDevices = devicesInfo.filter((deviceInfo) => {
        return deviceInfo.kind === "videoinput";
      });
      setDevices(filteredDevices);
      setDeviceId(filteredDevices[0].deviceId);
    });
  }, [toast]);

  const capture = useCallback(
    (deviceId: string) => {
      const imageSrc = webcamRef.current?.get(deviceId)?.getScreenshot({
        width: 300,
        height: 225,
      });
      onCapture(imageSrc);
    },
    [onCapture]
  );

  return (
    <div>
      {devices
        .filter((deviceInfo) => deviceInfo.deviceId === deviceId)
        .map((deviceInfo) => {
          console.log({ deviceInfo });
          return (
            <Cam
              key={deviceInfo.deviceId}
              ref={(ref) => webcamRef.current.set(deviceId, ref as Cam)}
              disablePictureInPicture
              onUserMedia={console.log}
              onUserMediaError={console.error}
              screenshotFormat="image/png"
              capture="user"
              screenshotQuality={0.5}
              videoConstraints={{ deviceId: deviceInfo.deviceId }}
            />
          );
        })}
      <SelectUI
        items={devices.map((deviceInfo) => ({
          label: deviceInfo.label,
          value: deviceInfo.deviceId,
        }))}
        placeholder="Select Camera"
        onValueChange={setDeviceId}
      />
      <Button className="mt-4" onClick={() => capture(deviceId)}>
        <span>Capture photo</span> {<CameraIcon />}
      </Button>
    </div>
  );
}
