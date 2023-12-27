import { MONGO_ERROR_CODES } from "./constants/db.constants";

export type DBFunctionRT<T> = { data?: T | null; error?: string | null };

export type TFuncResponse<T> = Promise<DBFunctionRT<T>>;

export const getMongoConstraintError = (errStr: string) => {
  if (errStr?.includes(MONGO_ERROR_CODES.DUPLICATE))
    return "Record Already exists";
  else return "Record not saved ! Please try again later";
};
