import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const { username, email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        const newUser = {
            username,
            email,
            password,
        };

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const body = JSON.stringify(newUser);

            const res = await axios.post('/api/auth/register', body, config);
            console.log(res.data);
            
            // Store token and user data
            login(res.data.user, res.data.token);
            
            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            console.error(err.response.data);
            setErrorMessage(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
            {/* Animated background shapes */}
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute bg-white opacity-10 rounded-full w-20 h-20 top-1/5 left-1/10 animate-float"></div>
                <div className="absolute bg-white opacity-10 rounded-full w-30 h-30 top-3/5 right-1/6 animate-float animation-delay-5000"></div>
                <div className="absolute bg-white opacity-10 rounded-full w-15 h-15 bottom-1/5 left-1/5 animate-float animation-delay-10000"></div>
                <div className="absolute bg-white opacity-10 rounded-full w-25 h-25 top-1/10 right-1/3 animate-float animation-delay-2000"></div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-12 border border-white border-opacity-20 shadow-lg max-w-md w-full relative z-10">
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-2 text-white text-3xl font-bold mb-2">
                        <div className="bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full w-10 h-10 flex items-center justify-center text-xl">🏃</div>
                        FitTrack Pro
                    </div>
                    <p className="text-white text-opacity-80 text-sm mb-1">Your Ultimate Fitness Companion</p>
                    <p className="text-yellow-400 font-semibold">Start your fitness journey today!</p>
                </div>

                {errorMessage && (
                    <div className="bg-red-200 text-red-700 p-3 rounded mb-4 text-sm">{errorMessage}</div>
                )}

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-white text-opacity-80 mb-1 font-medium">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-30 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-opacity-20 transition"
                            placeholder="Enter your username"
                            value={username}
                            onChange={onChange}
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-white text-opacity-80 mb-1 font-medium">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-30 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-opacity-20 transition"
                            placeholder="Enter your email"
                            value={email}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="block text-white text-opacity-80 mb-1 font-medium">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-30 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-opacity-20 transition"
                            placeholder="Enter your password"
                            value={password}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition flex justify-center items-center gap-2 ${
                            loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading && (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                ></path>
                            </svg>
                        )}
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="text-center mt-8 border-t border-white border-opacity-20 pt-6 text-white text-opacity-80">
                    <p>Already have an account?</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="text-yellow-400 font-semibold hover:text-yellow-300 transition"
                    >
                        Sign In Instead
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;
