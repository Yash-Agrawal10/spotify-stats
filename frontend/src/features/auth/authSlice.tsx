import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/state/store";
import api, { processError } from "../../app/api/api";
import { saveData, loadData, removeData } from "../../app/state/sessionStorage";

// Interfaces
interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  error: string | null;
}

interface LoginResponse {
  user: User;
  redirect_url: string;
}

// Reducers
export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    // Make API calls to get token and user
    const authResponse = await api.post("token/", credentials);
    const { refresh, access } = authResponse.data;
    const headers = { Authorization: `Bearer ${access}` };
    const userResponse = await api.get("users/me/", { headers });
    const user: User = userResponse.data.user as User;
    const spotifyAuthResponse = await api.get("spotify/auth/", { headers });
    const redirect_url = spotifyAuthResponse.data.auth_url;
    if (redirect_url) {
      // Save data to session storage
      saveData("access_token", access);
      saveData("refresh_token", refresh);
      saveData("isLoggedIn", true);
      saveData("user", user);
      // Return User
      return { user, redirect_url };
    }
    return rejectWithValue("Spotify authentication failed");
  } catch (error: any) {
    // Handle errors
    const errorMessage = processError(error);
    return rejectWithValue(errorMessage);
  }
});

// Create auth slice
const initialState: AuthState = {
  user: loadData("user") || null,
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
      removeData("isLoggedIn");
      removeData("user");
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<LoginResponse>) => {
        const user = action.payload.user;
        const redirect_url = action.payload.redirect_url;
        state.user = user;
        state.isLoggedIn = true;
        state.error = null;
        window.location.href = redirect_url;
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
