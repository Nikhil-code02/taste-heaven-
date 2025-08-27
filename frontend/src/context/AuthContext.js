import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    console.log('AuthContext: Checking token on mount:', token);
    if (token) {
      // You might want to verify the token with your backend here
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    console.log('AuthContext: Login called with:', { userData, token });
    localStorage.setItem('token', token);
    setUser({ ...userData, token });
  };

  const logout = () => {
    console.log('AuthContext: Logout called');
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
