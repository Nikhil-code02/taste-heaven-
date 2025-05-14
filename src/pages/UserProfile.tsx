import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        
        // If no userId is provided, redirect to current user's profile
        const uid = userId || currentUser?.uid;
        
        if (!uid) {
          navigate('/login');
          return;
        }
        
        const userProfile = await authService.getUserProfile(uid);
        
        if (userProfile) {
          setUserData(userProfile);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [userId, currentUser, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <p className="text-gray-600 font-medium">User profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-gray-100 min-h-screen p-4">
      <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-6">
        <div className="relative mr-4">
          {userData?.photoURL ? (
            <img src={userData.photoURL} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl font-bold">
              {userData.displayName?.charAt(0) || userData.email?.charAt(0) || '?'}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{userData?.displayName || 'User'}</h2>
          <p className="text-gray-600">{userData?.email || ''}</p>
          {userData?.bio && <p className="text-gray-600 mt-2">{userData.bio}</p>}
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-4">User Information</h3>
        {userData?.foodPreferences && userData.foodPreferences.length > 0 && (
          <div className="mb-4">
            <p className="text-gray-500 text-sm">Food Preferences</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {userData.foodPreferences.map((preference: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {preference}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {userData?.createdAt && (
          <div className="mb-4">
            <p className="text-gray-500 text-sm">Joined</p>
            <p>{new Date(userData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile; 