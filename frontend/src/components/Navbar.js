import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DarkModeContext } from '../context/DarkModeContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

    console.log('Navbar user:', user);

    return (
        <nav className="bg-white shadow-md dark:bg-gray-900">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link className="text-xl font-bold text-gray-800 dark:text-gray-200" to="/">FitnessTracker</Link>
                <div className="flex space-x-6 items-center">
                    <ul className="flex space-x-4 items-center">
                        <li>
                            <Link className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" to="/dashboard">Dashboard</Link>
                        </li>
                        <li>
                            <Link className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" to="/profile">Profile</Link>
                        </li>
                    </ul>
                    <ul className="flex space-x-4 items-center">
                        {user ? (
                            <li>
                                <button className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" onClick={logout}>Logout</button>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <Link className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" to="/login">Login</Link>
                                </li>
                                <li>
                                    <Link className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" to="/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                    <button
                        onClick={toggleDarkMode}
                        className="ml-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-md font-semibold shadow-md hover:bg-yellow-300 transition"
                    >
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
