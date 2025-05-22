/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import { useGetAllBookingsByUserIdQuery } from "../redux/slices/apiSlice";
import type { RootState } from "../redux/store";
import BookedInstrumentCard from "../components/BookedInstrumentCard";

const MyInstruments = () => {
	const { user } = useSelector((state: RootState) => state.auth); // Getting user data from Redux
	const userId = user?.id;

	const {
		data: bookings,
		isLoading,
		error,
	} = useGetAllBookingsByUserIdQuery(userId); // Fetch bookings for user
	if (!user || user?.role == "ADMIN") return;
	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error fetching bookings</div>;

	return (
		<div className='p-6 bg-gray-50 min-h-screen'>
			<h2 className='text-3xl font-semibold text-gray-800 mb-6'>
				My Booked Instruments
			</h2>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
				{bookings && bookings.length > 0 ? (
					bookings.map((booking: any) => (
						<BookedInstrumentCard key={booking.id} booking={booking} />
					))
				) : (
					<p className='col-span-full text-center text-gray-500'>
						You haven't booked any instruments yet.
					</p>
				)}
			</div>
		</div>
	);
};

export default MyInstruments;
