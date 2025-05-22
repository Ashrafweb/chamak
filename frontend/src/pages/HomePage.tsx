// src/pages/HomePage.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	useFetchInstrumentsQuery,
	useBookInstrumentMutation,
} from "../redux/slices/apiSlice";
import { setInstruments } from "../redux/slices/instrumentSlice";
import InstrumentCard from "../components/IntrumentCard";
import type { RootState } from "../redux/store";
import type { AppDispatch } from "../redux/store";
import MyInstruments from "../components/MyInstruments";

const HomePage = () => {
	const dispatch = useDispatch<AppDispatch>();

	// Select available and booked instruments from Redux state
	const { availableInstruments, bookedInstruments, loading, error } =
		useSelector((state: RootState) => state.instruments);

	// Fetch available instruments from the API
	const { data, isLoading, isError } = useFetchInstrumentsQuery({});
	const [bookInstrument] = useBookInstrumentMutation();
	useEffect(() => {
		if (data) {
			// Update Redux state with the fetched instruments
			dispatch(setInstruments(data));
		}
	}, [data, dispatch]);
	// Filter out already booked instruments
	const filteredInstruments = availableInstruments.filter(
		(instrument) =>
			!bookedInstruments.some((booked) => booked.id === instrument.id)
	);

	// Handle booking the instrument
	const handleBooking = (id: number) => {
		bookInstrument(id); // Dispatch API mutation to book the instrument
	};

	// Loading and error handling
	if (isLoading || loading) return <div>Loading...</div>;
	if (isError || error) return <div>{error || "Something went wrong"}</div>;

	return (
		<div className='home-page px-4 py-6 bg-gray-50'>
			<h1 className='text-3xl font-semibold text-gray-800 mb-6'>
				Available Instruments
			</h1>
			<div className='instrument-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
				{filteredInstruments.length > 0 ? (
					filteredInstruments.map((instrument) => (
						<InstrumentCard
							key={instrument.id}
							instrument={instrument}
							onBook={handleBooking}
						/>
					))
				) : (
					<p className='col-span-full text-center text-gray-500'>
						No instruments available at the moment.
					</p>
				)}
			</div>

			<div>
				<MyInstruments />
			</div>
		</div>
	);
};

export default HomePage;
