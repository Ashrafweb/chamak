/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useSubmitReceiptMutation } from "../redux/slices/apiSlice";

interface BookedInstrumentCardProps {
	booking: any;
}

const BookedInstrumentCard: React.FC<BookedInstrumentCardProps> = ({
	booking,
}) => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [fileError, setFileError] = useState<string | null>(null);
	const [submitReceipt] = useSubmitReceiptMutation();

	const handleReceiptUpload = async () => {
		if (!selectedFile) {
			alert("Please select a receipt file to upload.");
			return;
		}

		const formData = new FormData();
		formData.append("receiptFile", selectedFile);
		formData.append("bookingId", String(booking.id));

		try {
			await submitReceipt({ bookingId: booking.id, formData });
			alert("Receipt uploaded successfully!");
		} catch (err) {
			console.error("Error uploading receipt:", err);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files ? e.target.files[0] : null;

		if (file) {
			if (file.size > 1 * 1024 * 1024) {
				// 1MB = 1 * 1024 * 1024 bytes
				setFileError("File size should be less than 1MB.");
				setSelectedFile(null);
			} else {
				setFileError(null);
				setSelectedFile(file);
			}
		}
	};

	return (
		<div className='bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105'>
			<img
				src='/assets/stock_icon.png'
				alt={booking.instrument.name}
				className='w-[100px] h-48 object-cover rounded-lg mb-4'
			/>
			<h3 className='text-xl font-semibold text-gray-800'>
				{booking.instrument.name}
			</h3>
			<p className='text-sm text-gray-600'>
				Price: ${booking.instrument.currentPrice}
			</p>
			<p className='text-sm text-gray-600'>
				Estimated Return: {booking.instrument.estimatedReturn}%
			</p>
			<p className='text-sm text-gray-600'>
				Maturity Time: {booking.instrument.maturityTime} days
			</p>

			<p
				className='text-sm font-semibold mt-2'
				style={{
					color:
						booking.status === "PENDING"
							? "#FFA500"
							: booking.status === "APPROVED"
							? "#008000"
							: booking.status === "REJECTED"
							? "#FF0000"
							: "#000000",
				}}
			>
				{booking.status === "PURCHASED" ? (
					<div className='text-green-600 font-bold'>Owned By Me</div>
				) : (
					<div>Status: {booking.status}</div>
				)}
			</p>

			{booking.receipts.length > 0 && booking.status !== "PURCHASED" && (
				<p className='text-green-600 font-semibold'>Receipt Uploaded</p>
			)}

			{booking.receipts.length === 0 && booking.status === "PENDING" && (
				<div className='mt-4'>
					<label className='block text-gray-700 text-sm mb-2'>
						Upload Receipt
					</label>
					<input
						type='file'
						accept='image/*'
						onChange={handleFileChange}
						className='w-full p-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
					{fileError && <p className='text-red-500'>{fileError}</p>}

					<button
						onClick={handleReceiptUpload}
						className='mt-2 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200'
						disabled={fileError !== null}
					>
						Submit Receipt
					</button>
				</div>
			)}
		</div>
	);
};

export default BookedInstrumentCard;
