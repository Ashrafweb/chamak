// src/pages/BookingPage.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // For accessing URL parameters
import {
	useBookInstrumentMutation,
	useFetchInstrumentsQuery,
} from "../redux/slices/apiSlice"; // Assuming you have an API slice

const BookingPage = () => {
	const { id } = useParams<{ id: string }>(); // Get the instrument ID from URL
	const navigate = useNavigate();
	const [bookInstrument] = useBookInstrumentMutation();
	const { data: instrument, isLoading, isError } = useFetchInstrumentsQuery(id);

	const [units, setUnits] = useState(1);
	const [paymentMethod, setPaymentMethod] = useState("MFS");
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await bookInstrument({
				instrumentId: id,
				units,
				paymentMethod,
			}).unwrap();
			console.log("Booking successful:", response);
			// Navigate back or show confirmation
			navigate("/my-instruments"); // Redirect user to My Instruments page
		} catch (err: unknown) {
			setError("Failed to book the instrument. Please try again.");
			console.error(err);
		}
	};

	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error loading instrument details.</div>;

	return (
		<div className='max-w-lg mx-auto p-8 bg-white rounded-xl shadow-md'>
			<h2 className='text-2xl font-bold text-gray-800 mb-6'>
				Book {instrument?.name}
			</h2>
			<form onSubmit={handleSubmit} className='space-y-4'>
				{/* Units Selection */}
				<div>
					<label htmlFor='units' className='block text-gray-700'>
						Units
					</label>
					<input
						id='units'
						type='number'
						value={units}
						onChange={(e) => setUnits(Number(e.target.value))}
						min='1'
						className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
				</div>

				{/* Payment Method */}
				<div>
					<label htmlFor='payment-method' className='block text-gray-700'>
						Payment Method
					</label>
					<select
						id='payment-method'
						value={paymentMethod}
						onChange={(e) => setPaymentMethod(e.target.value)}
						className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
					>
						<option value='MFS'>MFS</option>
						<option value='Mobile Banking'>Mobile Banking</option>
					</select>
				</div>

				{/* Submit Button */}
				<button
					type='submit'
					className='w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition'
				>
					Confirm Booking
				</button>

				{/* Error message */}
				{error && <p className='text-red-500'>{error}</p>}
			</form>
		</div>
	);
};

export default BookingPage;
