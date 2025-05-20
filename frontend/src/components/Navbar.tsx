import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // You'll need to create this context

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth(); // Assuming you have an auth context

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Link to="/" className="text-xl font-bold">
                        Musical Instruments
                    </Link>
                    
                    {/* Common Links */}
                    <Link to="/instruments" className="hover:text-gray-300">
                        Instruments
                    </Link>

                    {/* User-specific links */}
                    {user && !user.isAdmin && (
                        <Link to="/my-instruments" className="hover:text-gray-300">
                            My Instruments
                        </Link>
                    )}

                    {/* Admin-specific links */}
                    {user && user.isAdmin && (
                        <Link to="/bookings" className="hover:text-gray-300">
                            Bookings
                        </Link>
                    )}
                </div>

                <div>
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;