import { apiUrls } from "@/constants";
import { configFetchInterceptor, getDefaultHeaders } from ".";
import { FetchUsersParamsT } from "../db/functions/users.functions";
import { Fetcher } from "swr";
import { IUserShortDto } from "../types/users.types";

class UsersRequests {
  constructor() {
    configFetchInterceptor();
  }

  getUsers: Fetcher<IUserShortDto[], FetchUsersParamsT> = async (
    payload: FetchUsersParamsT
  ) => {
    try {
      console.log("Payload", payload);
      const params = new URLSearchParams();
      params.set("batch", payload?.batch.toString());
      params.set("page", payload?.page.toString());
      params.set("searchText", payload?.searchText?.toString() || "");
      const reqUrl = apiUrls.users + "?" + params.toString();
      const resp = await fetch(reqUrl, {
        method: "GET",
        headers: getDefaultHeaders(),
      });
      const data = await resp.json();
      return data?.users || [];
    } catch (err) {
      console.log("ERROR requesting GET /api/users ::", err);
      throw new Error("Failed to fetch users");
    }
  };

  switchUserRole = async (id: string) => {
    try {
      const resp = await fetch(`${apiUrls.users}/${id}/admin`, {
        method: "PATCH",
        headers: getDefaultHeaders(),
      });
      const data = await resp.json();
      return resp;
    } catch (err) {
      console.log("ERROR: requesting /api/users/:userid/admin::", err);
      return null;
    }
  };
}

const userRequests = new UsersRequests();

export default userRequests;
