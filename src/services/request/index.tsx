import { USER_TOKEN } from "@/constants";

export const getDefaultHeaders = (headers: Record<string, string> = {}) => {
  const newHeaders = {
    ...headers,
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem(USER_TOKEN)}`,
  };
  return newHeaders;
};

export const configFetchInterceptor = () => {
  if (typeof window !== "undefined") {
    const { fetch: defaultFetch } = window;
    window.fetch = async (...args: any) => {
      let [resource, config] = args;
      try {
        const resp = await defaultFetch(resource, config);

        if (!resp.ok) {
          if (resp.status === 401) {
            window.location.replace("/logout");
            console.log("error response 401");
          }
          return Promise.reject(resp);
        }
        // when succeeding..
        return resp;
      } catch (err) {
        return Promise.reject(err);
      }
      //TODO: check for 401 & redirect the user
    };
  }
};
