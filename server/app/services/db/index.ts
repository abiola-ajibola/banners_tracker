import { connect as connectDb } from "mongoose";

async function connect(connection_string: string) {
  return await connectDb(connection_string, {
    dbName: process.env.DB_NAME || "",
  });
}

export const db = { connect };
