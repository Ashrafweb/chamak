// src/redux/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: "http://localhost:4000/api/", // Update with your API's base URL
		credentials: "include", // Ensure cookies are sent with requests (HTTP-only cookies)
	}),
	tagTypes: ["Auth", "Instrument", "Booking", "Receipt"], // Define tag types for invalidating cache
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
		}),
		bookInstrument: builder.mutation({
			query: (instrumentId) => ({
				url: "bookings/book",
				method: "POST",
				body: { ...instrumentId },
			}),
			invalidatesTags: ["Booking"],
		}),
		getAllBookingsByUserId: builder.query({
			query: (userId) => `/bookings/user/${userId}`,
			providesTags: ["Booking"],
		}),
		fetchBookings: builder.query({
			query: () => "/bookings", // API endpoint to fetch bookings
		}),
		updateBookingStatus: builder.mutation({
			query: ({ bookingId, receiptId, status }) => ({
				url: "/bookings/status",
				method: "PUT",
				body: { bookingId, receiptId, status },
			}),
		}),
		submitReceipt: builder.mutation({
			query: ({ formData }) => ({
				url: "/bookings/receipt/upload", // Adjust the URL for the receipt upload endpoint
				method: "POST",
				body: formData,
			}),
			invalidatesTags: ["Booking"],
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
	useFetchBookingsQuery,
	useUpdateBookingStatusMutation,
	useGetAllBookingsByUserIdQuery,
	useSubmitReceiptMutation,
} = api;
