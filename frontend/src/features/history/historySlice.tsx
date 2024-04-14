import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api, { processError } from "../../app/api/api";
import { loadData } from "../../app/state/sessionStorage";
import { RootState } from "../../app/state/store";

// Interfaces
interface HistoryState {
  data: any[];
  params: GetHistoryParams;
  error: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

interface GetHistoryParams {
  type: "history" | "tracks" | "artists" | "albums";
  limit: number;
  start: string | null;
  end: string | null;
}

interface GetHistoryResponse {
  data: any[];
  params: GetHistoryParams;
}

// Reducers
export const getHistory = createAsyncThunk<
  GetHistoryResponse,
  GetHistoryParams,
  { rejectValue: string }
>("history/get/", async (params, { rejectWithValue }) => {
  try {
    const headers = { Authorization: `Bearer ${loadData("access_token")}` };
    const response = await api.get("/history/get/", { headers, params });
    return { data: response.data, params: params };
  } catch (error: any) {
    const errorMessage: string = processError(error);
    return rejectWithValue(errorMessage);
  }
});

// Slice
const initialState: HistoryState = {
  data: [],
  params: { type: "history", limit: 10, start: null, end: null },
  error: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    // Reducer to handle local updates can be added here
  },
  extraReducers: (builder) => {
    builder
      .addCase(getHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getHistory.fulfilled, (state, action: PayloadAction<GetHistoryResponse>) => {
        state.status = "succeeded";
        state.data = action.payload.data;
        state.params = action.payload.params;
        state.error = null;
      })
      .addCase(
        getHistory.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload as string;
        }
      );
  },
});

// Exports
export default historySlice.reducer;
export const selectHistory = (state: RootState) => state.history;
