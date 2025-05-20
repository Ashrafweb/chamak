// src/pages/AuthPage.tsx
import { useEffect, useState } from "react";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
	const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
	const { user } = useSelector((state: RootState) => state.auth);
	const navigate = useNavigate();

	useEffect(() => {
		if (user) navigate("/");
	}, [user, navigate]);
	const toggleForm = () => {
		setIsLogin(!isLogin); // Toggle between forms
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
			<div className='w-full max-w-md bg-white p-8 rounded-xl shadow-lg'>
				<h1 className='text-3xl font-bold text-center text-gray-800 mb-6'>
					{isLogin ? "Login" : "Register"}
				</h1>
				{isLogin ? <Login /> : <Register />}

				<div className='text-center mt-6'>
					<button
						onClick={toggleForm}
						className='text-blue-600 hover:underline font-semibold'
					>
						{isLogin
							? "Don't have an account? Register"
							: "Already have an account? Login"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AuthPage;
