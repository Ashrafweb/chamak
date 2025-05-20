import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import MyInstrumentsPage from "./pages/MyInstrumentsPage";
import AdminPage from "./pages/admin/AdminPage";
import PrivateRoute from "./components/PrivateRoutes";
function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/auth' element={<AuthPage />} />
					<Route element={<PrivateRoute />}>
						<Route path='/booking/:id' element={<BookingPage />} />
						<Route path='/my-instruments' element={<MyInstrumentsPage />} />
						<Route path='/admin' element={<AdminPage />} />
					</Route>
				</Routes>
			</Router>
		</>
	);
}

export default App;
