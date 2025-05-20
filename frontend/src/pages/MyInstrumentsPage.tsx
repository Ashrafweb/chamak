// src/pages/MyInstrumentsPage.tsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import InstrumentCard from "../components/IntrumentCard";
import axios from "axios";
const MyInstrumentsPage = () => {
	const bookedInstruments = useSelector(
		(state: RootState) => state.instruments.bookedInstruments
	);
	const [uploadError, setUploadError] = useState<string | null>(null);

	const handleReceiptUpload = async (instrumentId: number, file: File) => {
		const formData = new FormData();
		formData.append("receiptFile", file);
		formData.append("bookingId", String(instrumentId));

		try {
			const response = await axios.post("/api/receipt/upload", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			console.log("Receipt uploaded successfully:", response.data);
		} catch (error: unknown) {
			setUploadError("Failed to upload receipt. Please try again.");
			console.error(error);
		}
	};
	return (
		<div className='p-6'>
			<h2 className='text-2xl font-semibold text-gray-800 mb-6'>
				My Booked Instruments
			</h2>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
				{bookedInstruments.length > 0 ? (
					bookedInstruments.map((instrument) => (
						<div key={instrument.id}>
							<InstrumentCard instrument={instrument} onBook={() => {}} />
							{instrument.status === "PENDING" && (
								<div>
									<input
										type='file'
										onChange={(e) => {
											if (e.target.files) {
												handleReceiptUpload(instrument.id, e.target.files[0]);
											}
										}}
										className='mt-4'
									/>
									{uploadError && (
										<p className='text-red-500 mt-2'>{uploadError}</p>
									)}
								</div>
							)}
						</div>
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

export default MyInstrumentsPage;
