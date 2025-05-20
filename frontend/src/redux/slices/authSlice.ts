// src/redux/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { api } from "./apiSlice";
// Retrieve user and token from localStorage if available
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: storedUser ? JSON.parse(storedUser) : null, // Parse the stored user object from localStorage
		token: storedToken ? storedToken : null, // Retrieve token from localStorage
	},
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload.user;
			state.token = action.payload.token;

			// Save to localStorage
			localStorage.setItem("user", JSON.stringify(action.payload.user));
			localStorage.setItem("token", action.payload.token);
		},
		logoutUser: (state) => {
			state.user = null;
			state.token = null;

			// Remove from localStorage
			localStorage.removeItem("user");
			localStorage.removeItem("token");
		},
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(
				api.endpoints.loginUser.matchFulfilled,
				(state, { payload }) => {
					state.user = payload.data;
					state.token = payload.token;

					// Save to localStorage
					localStorage.setItem("user", JSON.stringify(payload.data));
					localStorage.setItem("token", payload.token);
				}
			)
			.addMatcher(
				api.endpoints.registerUser.matchFulfilled,
				(state, { payload }) => {
					state.user = payload.data;
					state.token = payload.token;

					// Save to localStorage
					localStorage.setItem("user", JSON.stringify(payload.data));
					localStorage.setItem("token", payload.token);
				}
			)
			.addMatcher(api.endpoints.logoutUser.matchFulfilled, (state) => {
				state.user = null;
				state.token = null;

				// Remove from localStorage
				localStorage.removeItem("user");
				localStorage.removeItem("token");
			});
	},
});

export const { setUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
