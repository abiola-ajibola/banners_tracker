import {
  ChangeEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { Input } from "../../components/Input";
import { useUserDataContext } from "../../contexts/userData";
import { buttonVariants } from "../../components/Button/variants";

export function Email() {
  const { data, setData } = useUserDataContext();
  const [emailValid, setEmailValid] = useState(false);
  const inputRef: MutableRefObject<HTMLInputElement | null> = useRef(null);

  useEffect(() => {
    setEmailValid((state) => inputRef.current?.validity.valid || state);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData((data) => ({
      ...data,
      email: e.target.value || "",
      verified: false,
    }));
    setEmailValid(e.target.validity.valid);
    // send email to backend for verification using a verification code
  };
  return (
    <div className="h-[calc(100%-36px)] flex items-center">
      <div className="w-full">
        <Input
          ref={inputRef}
          id="email-input"
          className="text-xl h-12"
          onChange={handleChange}
          value={data.email}
          required
          type="email"
          placeholder="Email"
        />
        <button
          disabled={!emailValid}
          className={buttonVariants() + " mt-4 text-xl w-full !py-4 !h-[unset]"}
        >
          Verify Email
        </button>
      </div>
    </div>
  );
}
