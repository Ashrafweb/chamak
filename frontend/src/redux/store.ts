// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { api } from "./slices/apiSlice";
import instrumentsReducer from "./slices/instrumentSlice";
import authReducer from "./slices/authSlice";
export const store = configureStore({
	reducer: {
		api: api.reducer,
		instruments: instrumentsReducer,
		auth: authReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
