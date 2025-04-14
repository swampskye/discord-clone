import axios, { AxiosError } from "axios";
console.log(import.meta.env.BASE_URL);
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 1000,
  withCredentials: true,
});

request.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        const { data } = await axios.post(
          import.meta.env.VITE_API_BASE_URL + "/auth/refresh",
          {},
          { withCredentials: true }
        );
        window.location.reload();
      } catch (refreshErr) {
        console.error("RefreshErr");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default request;
