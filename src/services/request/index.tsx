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
    const { fetch: originalFetch } = window || {};
    window.fetch = async (...args: any) => {
      let [resource, config] = args;
      const response = await originalFetch(resource, config);
      //TODO: check for 401 & redirect the user
      console.log({ response });
      if (response.status === 401) {
        window.location.replace("/logout");
        console.log("error response 401");
        return response;
      } else {
        return response;
      }
    };
  }
};
