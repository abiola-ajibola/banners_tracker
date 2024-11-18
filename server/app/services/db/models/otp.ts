import { IOTP, OTP, TModel } from "../schemas";
import { Service } from "./service";

class OTP_Service extends Service<IOTP> {
  constructor(_Model: TModel<IOTP>) {
    super(_Model);
  }

  async findByEmail(email: string) {
    return await this._model.findOne({ email });
  }

  async insertOne({ email, value }: IOTP) {
    return this._model.create({
      email,
      value,
      expiresIn: Date.now() + 1000 * 60 * 60,
    });
  }
}

export const OTPService = new OTP_Service(OTP);
