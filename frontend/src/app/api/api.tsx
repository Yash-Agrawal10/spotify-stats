import axios, { isAxiosError } from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

export const processError = (error: any) => {
  let errorMessage = "An unexpected error occurred";
  if (isAxiosError(error)) {
    errorMessage = error.response?.data.detail || errorMessage;
  }
  return errorMessage;
};

export default api;
