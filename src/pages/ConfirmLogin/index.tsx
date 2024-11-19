import { useNavigate } from "react-router-dom";
import { OTPInputGroup } from "../../components/InputOTP";
import { useUserDataContext } from "../../contexts/userData";
import { useToast } from "../../hooks/useToast";
import { verifyOTP } from "../../lib/api";
import { IUser } from "../../types";

export function ConfirmLogin() {
  const { data: userData, setData } = useUserDataContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  async function handleOTP(value: string) {
    try {
      const { data, status } = await verifyOTP({
        email: userData.email,
        otp: value,
      });
      if (status === 200) {
        setData(data as IUser);
        navigate("/");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log({ e });
      if (e.response?.status === 404 && userData.verified) {
        navigate("/");
        return;
      }
      toast({
        variant: "destructive",
        description: e.response?.data?.message || "Sorry an error occured",
      });
    }
  }
  return (
    <div
      key="verify_email"
      className="h-[calc(100%-150px)] flex flex-col items-center w-full"
    >
      <p className="w-full text-center mt-auto mb-8">Please enter OTP</p>
      <div className="mx-auto mb-auto">
        <OTPInputGroup
          onComplete={(...args: string[]) => handleOTP(args.toString())}
        />
      </div>
    </div>
  );
}
