import { MONGO_ERROR_CODES } from "./constants/db.constants";

export type DBFunctionRT<T> = { data?: T | null; error?: string | null };

export type TFuncResponse<T> = Promise<DBFunctionRT<T>>;

export const getMongoConstraintError = (errStr: string) => {
  if (errStr?.includes(MONGO_ERROR_CODES.DUPLICATE))
    return "Record Already exists";
  else return "Record not saved ! Please try again later";
};

export const ERROR_MSG = {
  UNDER_MAINTENANCE: "Service under maintenance ! Please Try again later.",
  BAD_REQUEST: "Bad request ! Required Parameter missing.",
  UNAUTHORIZED_ACCESS: "Unauthorized Access.",
  USER_NOT_EXISTS: "User does not exists.",
};
