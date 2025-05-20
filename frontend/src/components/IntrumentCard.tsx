// src/components/InstrumentCard.tsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

interface InstrumentCardProps {
	instrument: {
		id: number;
		name: string;
		currentPrice: number;
		estimatedReturn: number;
		maturityTime: number;
		availableUnits: number;
		totalUnits: number;
		fractionalSupport: boolean;
		lockedUntil?: number;
		imageUrl?: string;
	};
	onBook: (id: number) => void;
}

const InstrumentCard: React.FC<InstrumentCardProps> = ({ instrument }) => {
	const navigate = useNavigate(); // Hook to navigate to the booking page
	const isLocked =
		instrument.lockedUntil && Date.now() < instrument.lockedUntil;

	// Handle "Book Now" button click
	const handleBookNow = () => {
		navigate(`/booking/${instrument.id}`); // Navigate to the booking page with the instrument ID
	};

	return (
		<div className='card bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105'>
			{/* Image Section */}
			<img
				src={instrument.imageUrl}
				alt={instrument.name}
				className='w-full h-48 object-cover rounded-lg mb-4'
			/>
			<h3 className='text-xl font-semibold text-gray-800'>{instrument.name}</h3>
			<p className='text-sm text-gray-600'>Price: ${instrument.currentPrice}</p>
			<p className='text-sm text-gray-600'>
				Estimated Return: {instrument.estimatedReturn}%
			</p>
			<p className='text-sm text-gray-600'>
				Maturity Time: {instrument.maturityTime} days
			</p>
			<p className='text-sm text-gray-600'>
				Available Units: {instrument.availableUnits}
			</p>

			{/* Booking Button */}
			{isLocked ? (
				<button
					disabled
					className='w-full mt-4 py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-lg cursor-not-allowed'
				>
					Locked for 6 hours
				</button>
			) : (
				<button
					onClick={handleBookNow} // On click, redirect to the booking page
					disabled={instrument.availableUnits === 0}
					className={`w-full mt-4 py-2 px-4 font-semibold rounded-lg ${
						instrument.availableUnits === 0
							? "bg-gray-400 text-gray-600 cursor-not-allowed"
							: "bg-blue-600 text-white hover:bg-blue-700"
					}`}
				>
					{instrument.availableUnits === 0 ? "Sold Out" : "Book Now"}
				</button>
			)}
		</div>
	);
};

export default InstrumentCard;
