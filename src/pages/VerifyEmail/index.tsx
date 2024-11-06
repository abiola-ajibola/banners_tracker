import { OTPInputGroup } from "../../components/InputOTP";

export function VerifyEmail() {
  return (
    <div
      key="verify_email"
      className="h-[calc(100%-150px)] flex items-center w-full"
    >
      <div className="m-auto">
        <OTPInputGroup onComplete={console.log} />
      </div>
    </div>
  );
}
