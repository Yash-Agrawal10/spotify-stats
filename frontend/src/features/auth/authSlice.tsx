import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/state/store";
import api from "../../app/api/api";
import { isAxiosError } from "axios";
import { saveData, loadData, removeData } from "../../app/state/localStorage";

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
    const { refresh, access } = response.data;
    saveData("access_token", access);
    saveData("refresh_token", refresh);
    saveData("email", credentials.email);
    saveData("isLoggedIn", true);
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
  email: loadData("email") || null,
  isLoggedIn: loadData("isLoggedIn") || false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    logout(state) {
      removeData("access_token");
      removeData("refresh_token");
      removeData("email");
      removeData("isLoggedIn");
      state.email = null;
      state.isLoggedIn = false;
      state.error = null;
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
