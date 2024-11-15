// import { DeleteResult, Document, QueryWithHelpers, Types } from "mongoose";
import {
  RootFilterQuery,
  Types,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from "mongoose";
import { TModel } from "../schemas";

// type TQuery<T> = QueryWithHelpers<
//   | (Document<unknown, object, T> &
//       T & {
//         _id: Types.ObjectId;
//       } & {
//         __v: number;
//       })
//   | null,
//   Document<unknown, object, T> &
//     T & {
//       _id: Types.ObjectId;
//     } & {
//       __v: number;
//     },
//   object,
//   T,
//   "findOne",
//   object
// >;

// type TDelete<T> = QueryWithHelpers<
//   DeleteResult,
//   Document<unknown, object, T> &
//     T & {
//       _id: Types.ObjectId;
//     } & {
//       __v: number;
//     },
//   object,
//   T,
//   "deleteOne",
//   object
// >;

// interface IService<T> {
//   getOne(id: string): TQuery<T>;
//   deleteOne(id: string): TDelete<T>;
// }

export class Service<U> /* implements IService<U> */ {
  _model;
  constructor(_Model: TModel<U>) {
    this._model = _Model;
  }

  getOneById(id: string) {
    return this._model.findById(id);
  }

  getOne(filter: RootFilterQuery<U>) {
    return this._model.findOne(filter).exec();
  }

  deleteOne(id: string) {
    return this._model.deleteOne({ id });
  }

  insertOne(data: U) {
    return this._model.create(data);
  }

  updateOneById(
    id: string | Types.ObjectId,
    data: UpdateQuery<U> | UpdateWithAggregationPipeline
  ) {
    return this._model.findOneAndUpdate({ _id: id }, data, { upsert: true });
  }
}
