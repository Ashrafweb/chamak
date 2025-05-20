// src/components/Register.tsx
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const Register = () => {
	const { register, apiError, isLoading } = useAuth();
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		register(formData.username, formData.email, formData.password);
	};

	return (
		<div className='w-full max-w-md mx-auto p-8 mt-12 bg-white '>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<input
					type='text'
					name='username'
					value={formData.username}
					onChange={handleChange}
					placeholder='Username'
					className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
					required
				/>
				<input
					type='email'
					name='email'
					value={formData.email}
					onChange={handleChange}
					placeholder='Email'
					className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
					required
				/>
				<input
					type='password'
					name='password'
					value={formData.password}
					onChange={handleChange}
					placeholder='Password'
					className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
					required
				/>
				<button
					type='submit'
					disabled={isLoading}
					className={`w-full py-2 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition ${
						isLoading ? "opacity-50 cursor-not-allowed" : ""
					}`}
				>
					{isLoading ? "Registering..." : "Register"}
				</button>
			</form>
			{apiError && (
				<p className='mt-4 text-sm text-red-500 text-center'>
					Something went wrong. Please try again.
				</p>
			)}
		</div>
	);
};

export default Register;
