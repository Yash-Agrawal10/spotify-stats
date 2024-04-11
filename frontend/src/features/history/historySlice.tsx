import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api, { processError } from "../../app/api/api";
import { RootState } from "../../app/state/store";

// Interfaces
interface HistoryItem {
  track: string;
  album: string;
  artists: string[];
  played_at: string;
}

interface TopItem {
  name: string;
  streams: number;
}

interface HistoryState {
  history: HistoryItem[];
  topArtists: TopItem[];
  topTracks: TopItem[];
  topAlbums: TopItem[];
  error: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

interface HistoryResponse {
  history: HistoryItem[];
}

interface TopResponse {
  artists: TopItem[];
  tracks: TopItem[];
  albums: TopItem[];
}

// Reducers
export const fetchHistory = createAsyncThunk<
  HistoryResponse,
  string,
  { rejectValue: string }
>("history/history", async (accessToken, { rejectWithValue }) => {
  try {
    const headers = { Authorization: `Bearer ${accessToken}` };
    const response = await api.get("/history/history/", {
      headers,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = processError(error);
    return rejectWithValue(errorMessage);
  }
});

export const fetchTop = createAsyncThunk<
  TopResponse,
  string,
  { rejectValue: string }
>("history/top", async (accessToken, { rejectWithValue }) => {
  try {
    const headers = { Authorization: `Bearer ${accessToken}` };
    const response = await api.get("/history/top/", { headers });
    return response.data;
  } catch (error: any) {
    const errorMessage = processError(error);
    return rejectWithValue(errorMessage);
  }
});

// Slice
const initialState: HistoryState = {
  history: [],
  topArtists: [],
  topTracks: [],
  topAlbums: [],
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
      .addCase(fetchHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHistory.fulfilled, (state, action:PayloadAction<HistoryResponse>) => {
        state.status = "succeeded";
        state.history = action.payload.history;
      })
      .addCase(fetchHistory.rejected, (state, action:PayloadAction<string | undefined>) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchTop.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTop.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.topArtists = action.payload.artists;
        state.topTracks = action.payload.tracks;
        state.topAlbums = action.payload.albums;
      })
      .addCase(fetchTop.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

// Exports
export default historySlice.reducer;
export const selectHistory = (state: RootState) => state.history.history;
