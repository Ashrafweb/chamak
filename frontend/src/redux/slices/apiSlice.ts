// src/redux/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: "http://localhost:4000/api/", // Update with your API's base URL
		credentials: "include", // Ensure cookies are sent with requests (HTTP-only cookies)
	}),
	tagTypes: ["Auth", "Instrument"], // Define tag types for invalidating cache
	endpoints: (builder) => ({
		// Auth endpoints
		loginUser: builder.mutation({
			query: (credentials) => ({
				url: "users/login",
				method: "POST",
				body: credentials,
			}),
			// Automatically set up tags for cache invalidation if needed
			// Provides access to the current user's data
			invalidatesTags: [{ type: "Auth" }],
		}),
		registerUser: builder.mutation({
			query: (userData) => ({
				url: "users/create",
				method: "POST",
				body: userData,
			}),
			invalidatesTags: [{ type: "Auth" }],
		}),
		logoutUser: builder.mutation({
			query: () => ({
				url: "users/logout",
				method: "POST",
			}),
			invalidatesTags: [{ type: "Auth" }],
		}),

		// Instrument endpoints
		fetchInstruments: builder.query({
			query: () => "instruments",
			providesTags: ["Instrument"],
		}),
		getInstrumentById: builder.query({
			query: (id) => `instruments/${id}`,
			providesTags: ["Instrument"],
		}),
		createInstrument: builder.mutation({
			query: (newInstrument) => ({
				url: "instruments/create",
				method: "POST",
				body: newInstrument,
			}),
			invalidatesTags: ["Instrument"], // Invalidate the instruments cache
		}),
		bookInstrument: builder.mutation({
			query: (instrumentId) => ({
				url: "instruments/book",
				method: "POST",
				body: { instrumentId },
			}),
			invalidatesTags: ["Instrument"],
		}),
	}),
});

export const {
	useLoginUserMutation,
	useRegisterUserMutation,
	useLogoutUserMutation,
	useFetchInstrumentsQuery,
	useGetInstrumentByIdQuery,
	useCreateInstrumentMutation,
	useBookInstrumentMutation,
} = api;
