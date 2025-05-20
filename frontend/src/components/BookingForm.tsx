// src/components/BookingForm.tsx
import React, { useState } from "react";
import { useBookInstrumentMutation } from "../redux/slices/apiSlice";
import { useAuth } from "../hooks/useAuth";

interface BookingFormProps {
	instrumentId: number;
	onBookingComplete: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
	instrumentId,
	onBookingComplete,
}) => {
	const [units, setUnits] = useState(1);
	const [paymentMethod, setPaymentMethod] = useState("MFS");
	const [receipt, setReceipt] = useState<File | null>(null);
	const [bookingStatus, setBookingStatus] = useState<string | null>(null);
	const [bookInstrument] = useBookInstrumentMutation();
	const { isLoading } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await bookInstrument({
				instrumentId,
				units,
				paymentMethod,
			}).unwrap();
			console.log(response);
			setBookingStatus("Booking successful. Please upload the receipt.");
			onBookingComplete();
		} catch (err: unknown) {
			setBookingStatus("Failed to book the instrument. Please try again.");
			console.error(err);
		}
	};

	const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setReceipt(e.target.files[0]);
		}
	};

	const handleReceiptSubmit = async () => {
		if (receipt) {
			// Implement receipt upload logic here (sending the file to your server)
			console.log("Receipt uploaded:", receipt);
			setBookingStatus("Receipt uploaded successfully.");
		}
	};

	return (
		<div className='p-8 bg-white rounded-xl shadow-md max-w-lg mx-auto'>
			<h2 className='text-xl font-semibold text-gray-800 mb-4'>Booking Form</h2>
			<form onSubmit={handleSubmit} className='space-y-4'>
				{/* Units */}
				<div>
					<label htmlFor='units' className='block text-gray-700'>
						Select Units
					</label>
					<input
						id='units'
						type='number'
						value={units}
						onChange={(e) => setUnits(Number(e.target.value))}
						min='1'
						className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
						required
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

				{/* Booking Status */}
				{bookingStatus && (
					<p className='text-sm text-gray-500'>{bookingStatus}</p>
				)}

				{/* Submit Button */}
				<button
					type='submit'
					disabled={isLoading || units <= 0}
					className={`w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition ${
						isLoading || units <= 0 ? "opacity-50 cursor-not-allowed" : ""
					}`}
				>
					{isLoading ? "Booking..." : "Confirm Booking"}
				</button>
			</form>

			{/* Upload Receipt */}
			{bookingStatus === "Booking successful. Please upload the receipt." && (
				<div className='mt-6'>
					<input
						type='file'
						accept='image/*'
						onChange={handleReceiptUpload}
						className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
					<button
						type='button'
						onClick={handleReceiptSubmit}
						className='mt-4 w-full py-2 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition'
					>
						Upload Receipt
					</button>
				</div>
			)}
		</div>
	);
};

export default BookingForm;
