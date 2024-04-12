import axios, { isAxiosError } from "axios";

const baseURL = import.meta.env.VITE_API_URL as string;
const api = axios.create({
  baseURL: baseURL,
});

api.defaults.validateStatus = function (status: number) {
  if (status >= 400) {
    return false;
  }
  return true;
};

export const processError = (error: any) => {
  let errorMessage = "An unexpected error occurred";
  if (isAxiosError(error)) {
    errorMessage = error.response?.data.detail || errorMessage;
  }
  // Add in error handling that re logs in a user if their token expired
  return errorMessage;
};

export default api;
