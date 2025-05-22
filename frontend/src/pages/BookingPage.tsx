/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // For accessing URL parameters
import {
	useBookInstrumentMutation,
	useGetInstrumentByIdQuery,
} from "../redux/slices/apiSlice"; // Assuming you have an API slice
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2 } from "lucide-react";

// Default Yup validation schema for Units
const getBookingSchema = (fractionalSupport: boolean) => {
	return yup.object().shape({
		units: fractionalSupport
			? yup
					.number()
					.typeError("Units is required.")
					.required("Units is required.")
					.positive("Units must be greater than zero.")
					.min(0.01, "Units must be greater than zero.")
					.max(1000, "Units must be less than or equal to 1000.")
			: yup
					.number()
					.typeError("Units is required.")
					.required("Units is required.")
					.positive("Units must be greater than zero.")
					.integer("Units must be an integer.")
					.min(1, "Units must be greater than or equal to 1.")
					.max(1000, "Units must be less than or equal to 1000."),
		paymentMethod: yup.string().required("Payment method is required."),
	});
};

type BookingFormData = {
	units: number;
	paymentMethod: string;
};

const BookingPage = () => {
	const { id } = useParams<{ id: string }>(); // Get the instrument ID from URL
	const navigate = useNavigate();
	const [bookInstrument, { isLoading: isBooking }] =
		useBookInstrumentMutation();
	const {
		data: instrument,
		isLoading,
		isError,
	} = useGetInstrumentByIdQuery(id);
	const user = useSelector((state: RootState) => state.auth.user);
	const [error, setError] = useState<string | null>(null);

	// Conditional validation schema based on instrument.fractionalSupport
	const [validationSchema, setValidationSchema] = useState<any>(null);

	useEffect(() => {
		if (instrument) {
			setValidationSchema(getBookingSchema(instrument.fractionalSupport));
		}
	}, [instrument]);

	// React Hook Form setup with dynamically loaded Yup schema
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<BookingFormData>({
		resolver: yupResolver(validationSchema),
	});

	const onSubmit = async (data: BookingFormData) => {
		try {
			const response = await bookInstrument({
				instrumentId: id,
				bookedUnits: data.units,
				paymentMethod: data.paymentMethod,
				userId: user.id,
			}).unwrap();
			console.log("Booking successful:", response);

			navigate("/my-instruments");
		} catch (err: any) {
			if (err.data) {
				setError(err.data.message);
				return;
			}
			setError("Failed to book the instrument. Please try again.");
			console.error(err.data);
		}
	};

	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error loading instrument details.</div>;

	return (
		<div className='flex flex-col lg:flex-row p-6 bg-gray-50 min-h-screen'>
			{/* Instrument Details Box (Left side) */}
			<div className='flex-1 p-6 bg-white rounded-xl shadow-md mb-6 lg:mr-6'>
				<h2 className='text-2xl font-semibold text-gray-800 mb-4'>
					{instrument?.name}
				</h2>
				<img
					src='/assets/stock_icon.png'
					alt={instrument?.name}
					className='w-[200px] object-cover rounded-lg mb-4'
				/>
				<p className='text-gray-600 mb-2'>Price: ${instrument?.currentPrice}</p>
				<p className='text-gray-600 mb-2'>
					Estimated Return: {instrument?.estimatedReturn}%
				</p>
				<p className='text-gray-600 mb-2'>
					Maturity Time: {instrument?.maturityTime} days
				</p>
				<p className='text-lg font-bold'>
					Available Units : {instrument?.availableUnits}
				</p>
				{/* Add any other instrument details you need */}
			</div>

			{/* Booking Form (Right side) */}
			<div className='flex-1 p-6 bg-white rounded-xl shadow-md'>
				<h2 className='text-2xl font-semibold text-gray-800 mb-6'>
					Book {instrument?.name}
				</h2>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					{/* Units Selection */}
					<div>
						<label htmlFor='units' className='block text-gray-700'>
							Units
						</label>
						<input
							id='units'
							type='number'
							{...register("units")}
							className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
						{errors.units && (
							<p className='text-red-500'>{errors.units.message}</p>
						)}
					</div>

					{/* Payment Method */}
					<div>
						<label htmlFor='payment-method' className='block text-gray-700'>
							Payment Method
						</label>
						<select
							id='payment-method'
							{...register("paymentMethod")}
							className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
						>
							<option value='MFS'>MFS</option>
							<option value='Mobile Banking'>Mobile Banking</option>
						</select>
						{errors.paymentMethod && (
							<p className='text-red-500'>{errors.paymentMethod.message}</p>
						)}
					</div>

					{/* Submit Button */}
					<button
						type='submit'
						className='w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer'
						disabled={isBooking} // Disable button when booking is in progress
					>
						{isBooking ? (
							<Loader2
								className='mx-auto animate-spin'
								size={24}
								color='#fff'
							/>
						) : (
							"Confirm Booking"
						)}
					</button>

					{/* Error message */}
					{error && <p className='text-red-500'>{error}</p>}
				</form>
			</div>
		</div>
	);
};

export default BookingPage;
