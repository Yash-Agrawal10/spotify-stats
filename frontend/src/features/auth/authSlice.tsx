import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import api from "../../app/api";
import { isAxiosError } from "axios";

// Interfaces
interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthState {
  email: string | null;
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
const initialState: AuthState = {
  email: null,
  isLoggedIn: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      state.email = null;
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<LoginCredentials>) => {
        state.email = action.payload.email;
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
