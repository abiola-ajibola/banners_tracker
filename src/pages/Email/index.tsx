import {
  ChangeEvent,
  MouseEvent as ReactMouseEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { Input } from "../../components/Input";
import { useUserDataContext } from "../../contexts/userData";
import { buttonVariants } from "../../components/Button/variants";
import { auth } from "../../lib/api";
import { useNavigate } from "react-router-dom";

export function Email(props: { expired?: boolean }) {
  const { data, setData } = useUserDataContext();
  const [emailValid, setEmailValid] = useState(false);
  const inputRef: MutableRefObject<HTMLInputElement | null> = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    setEmailValid((state) => inputRef.current?.validity.valid || state);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmailValid(e.target.validity.valid);
  };

  async function handleSubmit(
    _e: ReactMouseEvent<HTMLButtonElement, MouseEvent>,
    expired: boolean | undefined
  ) {
    const { data: user, status } = await auth(
      expired
        ? {
            email: inputRef.current?.value as string,
            reset: expired,
          }
        : { email: inputRef.current?.value as string }
    );
    if (status === 204) {
      setData({
        _id: "",
        role: "client",
        email: user.email as string,
        verified: false,
      });
      return;
    }
    if (status === 200) {
      setData((state) => ({ ...state, email: user.email as string }));
      navigate("/otp");
    }

    if (status === 201) {
      navigate("/verify_message");
    }
    return;
  }

  return (
    <div className="h-[calc(100%-36px)] flex items-center">
      <div className="w-full">
        {props.expired && (
          <p className="w-full">
            Verificationtoken expired, please enter you email again
          </p>
        )}
        <Input
          ref={inputRef}
          id="email-input"
          className="text-xl h-12"
          onChange={handleChange}
          defaultValue={data.email}
          required
          type="email"
          placeholder="Email"
        />
        <button
          disabled={!emailValid}
          className={buttonVariants() + " mt-4 text-xl w-full !py-4 !h-[unset]"}
          onClick={(e) => handleSubmit(e, props.expired)}
          type="button"
        >
          Verify Email
        </button>
      </div>
    </div>
  );
}
