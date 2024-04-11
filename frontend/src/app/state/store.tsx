import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../../features/auth/authSlice";
import historyReducer from "../../features/history/historySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    history: historyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
