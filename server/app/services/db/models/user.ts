import { RootFilterQuery } from "mongoose";
import { IUser, TModel, User } from "../schemas";
import { Service } from "./service";

class UserService extends Service<IUser> {
  constructor(_Model: TModel<IUser>) {
    super(_Model);
  }

  async findByEmail(email: string) {
    return await this._model.findOne({ email });
  }

  async findMany(
    filter: RootFilterQuery<IUser>,
    pagination: { page: number; perPage: number } = { page: 1, perPage: 10 }
  ) {
    return this._model.find(filter, null, {
      skip: (pagination.page - 1) * pagination.perPage,
      limit: pagination.perPage,
    });
  }
}

export const userService = new UserService(User);
