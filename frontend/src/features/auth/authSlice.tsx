import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import api from "../../app/api";
import { isAxiosError } from "axios";

// Interfaces
interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  error: string | null;
}

// Reducers
export const loginUser = createAsyncThunk<
  LoginCredentials,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post("token/", credentials);
    const { access, refresh } = response.data;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("email", credentials.email);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("first_name", "Temporary");
    localStorage.setItem("last_name", "Name");
    return credentials;
  } catch (error: any) {
    let errorMessage = "An error occurred";
    if (isAxiosError(error) && error.response) {
      errorMessage = error.response.data.detail || errorMessage;
    }
    return rejectWithValue(errorMessage);
  }
});

// Create auth slice
const initialUser = {
  email: localStorage.getItem("email") || "",
  first_name: localStorage.getItem("first_name") || "",
  last_name: localStorage.getItem("last_name") || "",
};

const initialState: AuthState = {
  user: initialUser,
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true" ? true : false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("email");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("first_name");
      localStorage.removeItem("last_name");
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<LoginCredentials>) => {
        const user: User = {
          email: action.payload.email,
          first_name: "Temporary",
          last_name: "Name",
        };
        console.log(user);
        state.user = user;
        state.isLoggedIn = true;
        state.error = null;
      }
    );
    builder.addCase(
      loginUser.rejected,
      (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || "An unexpected error occurred";
      }
    );
  },
});

// Exports
export default authSlice.reducer;
export const { logout } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
