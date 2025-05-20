/* eslint-disable @typescript-eslint/no-unused-vars */
// src/redux/instrumentSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { api } from "./apiSlice";
const instrumentSlice = createSlice({
	name: "instruments",
	initialState: {
		availableInstruments: [] as Instrument[],
		bookedInstruments: [] as Instrument[],
		loading: false,
		error: null,
	},
	reducers: {
		setInstruments: (state, action) => {
			state.availableInstruments = action.payload;
		},
		resetInstruments: (state) => {
			state.availableInstruments = [];
			state.bookedInstruments = [];
		},
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(
				api.endpoints.fetchInstruments.matchFulfilled,
				(state, { payload }) => {
					state.availableInstruments = payload;
				}
			)
			.addMatcher(
				api.endpoints.bookInstrument.matchFulfilled,
				(state, { payload }) => {
					state.bookedInstruments.push(payload);
					state.availableInstruments = state.availableInstruments.filter(
						(instrument) => instrument.id !== payload.id
					);
				}
			)
			.addMatcher(
				api.endpoints.getInstrumentById.matchFulfilled,
				(state, { payload }) => {
					// Handle single instrument fetch
				}
			);
	},
});

export const { setInstruments, resetInstruments } = instrumentSlice.actions;

export default instrumentSlice.reducer;
