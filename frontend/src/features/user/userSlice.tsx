import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../app/api/api";
import { saveData, loadData } from "../../app/state/localStorage";
import { RootState } from "../../app/state/store";

// Interfaces
interface User {
  email: string;
  first_name: string;
  last_name: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Reducers
export const fetchUser = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("user/me", async (token, { rejectWithValue }) => {
  console.log("Called fetchUser");
  try {
    const response = await api.get("users/me/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    saveData("user", response.data);
    return response.data as User;
  } catch (error: any) {
    let errorMessage = "An error occurred";
    if (error.response) {
      errorMessage = error.response.data.detail || errorMessage;
    }
    return rejectWithValue(errorMessage);
  }
});

// Create user slice
const initialState: UserState = {
  user: loadData("user") || null,
  loading: false,
  error: "default error",
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchUser.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      }
    );
    builder.addCase(
      fetchUser.rejected,
      (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "An unexpected error occurred";
      }
    );
  },
});

export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;
