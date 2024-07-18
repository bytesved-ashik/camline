import { apiBaseUrl } from "src/constants/environmentConstant";
import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";
import { getSession } from "next-auth/react";

if (!apiBaseUrl) {
  throw new Error("No Api apiBaseUrl");
}
axios.defaults.headers.post["Content-Type"] = "application/json";
const createApi = (path: string) => {
  const api = axios.create({
    baseURL: `${apiBaseUrl}${path}`,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  });
  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.set("Authorization", `Bearer ${session.accessToken}`);
      }

      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  return api;
};

export default createApi;
