import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Taste Haven
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link to="/menu" className="text-gray-600 hover:text-primary-600">
              Menu
            </Link>
            <Link to="/reservation" className="text-gray-600 hover:text-primary-600">
              Reservations
            </Link>
            {currentUser ? (
              <>
                <Link to="/profile" className="text-gray-600 hover:text-primary-600">
                  Profile
                </Link>
                <button
                  onClick={() => logout()}
                  className="text-gray-600 hover:text-primary-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600">
                  Login
                </Link>
                <Link to="/register" className="text-gray-600 hover:text-primary-600">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header; 