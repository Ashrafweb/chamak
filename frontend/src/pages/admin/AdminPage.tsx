// src/pages/AdminPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios"; // For making API requests
import type { BookingResponse } from "../../types/types";

const AdminPage = () => {
	const [bookings, setBookings] = useState<BookingResponse[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const fetchBookings = async () => {
		setLoading(true);
		try {
			const response = await axios.get("/api/bookings"); // Fetch all bookings
			setBookings(response.data);
		} catch (error: unknown) {
			console.error("Error fetching bookings", error);
		} finally {
			setLoading(false);
		}
	};

	const handleStatusChange = async (receiptId: number, status: string) => {
		try {
			await axios.put("/api/receipt/status", { receiptId, status });
			fetchBookings(); // Refresh the list after status change
		} catch (error: unknown) {
			console.error("Error updating status", error);
		}
	};

	useEffect(() => {
		fetchBookings();
	}, []);

	return (
		<div className='p-6'>
			<h2 className='text-2xl font-semibold text-gray-800 mb-6'>
				Admin Bookings
			</h2>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div className='space-y-6'>
					{bookings.map((booking) => (
						<div key={booking.id} className='bg-white p-4 rounded-lg shadow-lg'>
							<h3 className='text-xl font-semibold text-gray-800'>
								{booking.instrumentName}
							</h3>
							<p className='text-sm text-gray-600'>User: {booking.userName}</p>
							{booking.receiptUrl ? (
								<div>
									<img
										src={booking.receiptUrl}
										alt='Receipt'
										className='w-40 h-40 object-cover rounded-lg mt-4'
									/>
									<div className='mt-4 flex space-x-4'>
										<button
											onClick={() =>
												booking.receiptId &&
												handleStatusChange(booking.receiptId, "VERIFIED")
											}
											className='px-4 py-2 bg-green-600 text-white rounded-lg'
										>
											Verify
										</button>
										<button
											onClick={() =>
												booking.receiptId &&
												handleStatusChange(booking.receiptId, "REJECTED")
											}
											className='px-4 py-2 bg-red-600 text-white rounded-lg'
										>
											Reject
										</button>
									</div>
								</div>
							) : (
								<p className='text-gray-500 mt-4'>No receipt uploaded yet.</p>
							)}
							<p className='text-sm text-gray-600 mt-2'>
								Status: {booking.status}
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default AdminPage;
