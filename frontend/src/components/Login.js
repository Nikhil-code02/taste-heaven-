import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DarkModeContext } from '../context/DarkModeContext';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      // Simulate login API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (email && password) {
        login({ email }, 'dummy-token');
        setSuccessMessage('Login successful! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setErrorMessage('Please fill in all fields correctly.');
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
          <p className="text-yellow-400 font-semibold">Welcome back! Ready to continue your fitness journey?</p>
        </div>

        {errorMessage && (
          <div className="bg-red-200 text-red-700 p-3 rounded mb-4 text-sm">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="bg-green-200 text-green-700 p-3 rounded mb-4 text-sm">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-white text-opacity-80 mb-1 font-medium">Email Address</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-30 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-opacity-20 transition"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-white text-opacity-80 mb-1 font-medium">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-30 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-opacity-20 transition"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-between items-center text-white text-opacity-80 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="form-checkbox text-yellow-400" />
              Remember me
            </label>
            <button
              type="button"
              className="text-yellow-400 hover:text-yellow-300 transition"
              onClick={() => alert('Password reset functionality would be implemented here.')}
            >
              Forgot password?
            </button>
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center justify-center gap-3 text-white text-opacity-60 mt-6">
          <hr className="flex-grow border-white border-opacity-30" />
          <span>or continue with</span>
          <hr className="flex-grow border-white border-opacity-30" />
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => alert('Google login would be implemented here in a real app.')}
            className="flex-1 py-2 rounded-lg bg-white bg-opacity-20 text-white font-medium hover:bg-opacity-30 transition"
          >
            🔍 Google
          </button>
          <button
            onClick={() => alert('Facebook login would be implemented here in a real app.')}
            className="flex-1 py-2 rounded-lg bg-white bg-opacity-20 text-white font-medium hover:bg-opacity-30 transition"
          >
            👤 Facebook
          </button>
        </div>

        <div className="text-center mt-8 border-t border-white border-opacity-20 pt-6 text-white text-opacity-80">
          <p>Don't have an account?</p>
          <button
            onClick={() => alert('Sign up page would be shown here in a real app.')}
            className="text-yellow-400 font-semibold hover:text-yellow-300 transition"
          >
            Create Account - It's Free!
          </button>
        </div>

        <div className="absolute top-4 right-4">
          <button
            onClick={toggleDarkMode}
            className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-md font-semibold shadow-md hover:bg-yellow-300 transition"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
