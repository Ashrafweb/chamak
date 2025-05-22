// src/pages/AdminPage.tsx
import React, { useState } from "react";
import {
	useFetchBookingsQuery,
	useUpdateBookingStatusMutation,
} from "../../redux/slices/apiSlice";
import type { BookingResponse } from "../../types/types";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../../components/ui/dialog";

const AdminPage = () => {
	const {
		data: bookings,
		isLoading,
		error,
		refetch,
	} = useFetchBookingsQuery({});
	const [updateBookingStatus] = useUpdateBookingStatusMutation();
	const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
	const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
		null
	);
	const [selectedReceiptId, setSelectedReceiptId] = useState<number | null>(
		null
	);
	const [selectedStatus, setSelectedStatus] = useState<string>("");
	const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility
	const [selectedImage, setSelectedImage] = useState<string | null>(null); // To store the selected image

	// Handle status change (Verify/Reject)
	const handleStatusChange = async () => {
		if (selectedBookingId && selectedReceiptId && selectedStatus) {
			try {
				await updateBookingStatus({
					bookingId: selectedBookingId,
					receiptId: selectedReceiptId,
					status: selectedStatus,
				}).unwrap();
				await refetch();
				setIsOpenModal(false); // Close the modal after status change
			} catch (error) {
				console.error("Failed to update booking status", error);
			}
		}
	};

	const handleImageClick = (src: string) => {
		setSelectedImage(src); // Set the clicked image's src
		setIsModalOpen(true); // Open the modal
	};

	const handleCloseModal = () => {
		setIsModalOpen(false); // Close the modal
		setSelectedImage(null); // Reset selected image
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error fetching bookings</div>;

	return (
		<div className='p-6'>
			<h2 className='text-2xl font-semibold text-gray-800 mb-6'>
				All Bookings
			</h2>
			<div className='overflow-x-auto bg-white rounded-lg shadow-md'>
				<table className='min-w-full table-auto'>
					<thead>
						<tr>
							<th className='px-4 py-2 border-b text-left'>Booking ID</th>
							<th className='px-4 py-2 border-b text-left'>User</th>
							<th className='px-4 py-2 border-b text-left'>Receipt</th>
							<th className='px-4 py-2 border-b text-left'>Status</th>
							<th className='px-4 py-2 border-b text-left'>Actions</th>
						</tr>
					</thead>
					<tbody>
						{bookings.map((booking: BookingResponse) => (
							<tr key={booking.id}>
								<td className='px-4 py-2 border-b'>{booking.id}</td>
								<td className='px-4 py-2 border-b text-wrap'>
									ID : {booking.user.id} <br />
									{booking.user.username} <br />
									{booking.user.email} <br />
								</td>
								<td className='px-4 py-2 border-b'>
									{booking.receipts.length > 0 &&
									booking.receipts[0].receiptUrl ? (
										<img
											src={booking.receipts[0].receiptUrl}
											alt='Receipt'
											className='w-24 h-24 object-cover'
											onClick={() =>
												handleImageClick(booking.receipts[0].receiptUrl)
											} // Open modal on click
										/>
									) : (
										<span>No Receipt</span>
									)}
								</td>
								<td className='px-4 py-2 border-b'>{booking.status}</td>
								<td className='px-4 py-2 border-b'>
									{booking.status === "PENDING" && (
										<div className='flex space-x-4'>
											<button
												onClick={() => {
													setSelectedBookingId(booking.id);
													setSelectedReceiptId(booking.receipts[0].id);
													setSelectedStatus("VERIFIED");
													setIsOpenModal(true);
												}}
												className='px-4 py-2 bg-green-600 text-white rounded-lg'
											>
												Verify
											</button>
											<button
												onClick={() => {
													setSelectedBookingId(booking.id);
													setSelectedReceiptId(booking.receipts[0].id);
													setSelectedStatus("REJECTED");
													setIsOpenModal(true);
												}}
												className='px-4 py-2 bg-red-600 text-white rounded-lg'
											>
												Reject
											</button>
										</div>
									)}
									{booking.status !== "PENDING" && (
										<span className='text-gray-500'>Status Locked</span>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Dialog Modal */}
			<Dialog open={isOpenModal}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className='text-center pb-4'>
							Are you absolutely sure?
						</DialogTitle>
						<DialogDescription>
							<div className='flex justify-evenly'>
								<button
									className='px-4 py-2 rounded-md bg-green-600 text-white'
									onClick={handleStatusChange}
								>
									Confirm
								</button>
								<button
									className='px-4 py-2 rounded-md bg-red-600 text-white'
									onClick={() => setIsOpenModal(false)}
								>
									Cancel
								</button>
							</div>
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>

			{/* Modal for full view image */}
			{isModalOpen && (
				<div
					className='fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50'
					onClick={handleCloseModal} // Close the modal if clicked outside
				>
					<div
						className='bg-white p-4 rounded-lg'
						onClick={(e) => e.stopPropagation()} // Prevent closing if clicked inside the modal
					>
						<button
							onClick={handleCloseModal}
							className='absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full'
						>
							Close
						</button>
						<img
							src={selectedImage!}
							alt='Full View'
							className='max-w-full max-h-screen'
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminPage;
