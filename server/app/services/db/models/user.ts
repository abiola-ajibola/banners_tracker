import { IUser, TModel, User } from "../schemas";
import { Service } from "./service";

class UserService extends Service<IUser> {
  constructor(_Model: TModel<IUser>) {
    super(_Model);
  }

  async findByEmail(email: string) {
    return await this._model.findOne({ email }).exec();
  }
}

export const userService = new UserService(User);
