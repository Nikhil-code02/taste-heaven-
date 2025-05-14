import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { authService, UserProfile } from '../../services/authService';

interface ProfileFormData {
  displayName: string;
  phoneNumber: string;
}

const ProfileManager: React.FC = () => {
  const { currentUser } = useAuth();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormData>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    const loadProfile = async () => {
      if (currentUser) {
        try {
          const userProfile = await authService.getUserProfile(currentUser.uid);
          if (userProfile) {
            setProfile(userProfile);
            setValue('displayName', userProfile.displayName);
            setValue('phoneNumber', userProfile.phoneNumber || '');
          }
        } catch (error) {
          setError('Failed to load profile');
        }
      }
    };

    loadProfile();
  }, [currentUser, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!currentUser) return;

    try {
      setError('');
      setSuccess('');
      await authService.updateUserProfile(currentUser.uid, {
        displayName: data.displayName,
        phoneNumber: data.phoneNumber
      });
      setSuccess('Profile updated successfully');
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  if (!currentUser) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Profile Information
          </h3>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  value={currentUser.email || ''}
                  disabled
                  className="bg-gray-50 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="displayName"
                  type="text"
                  {...register('displayName', { required: 'Name is required' })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.displayName && (
                  <p className="mt-2 text-sm text-red-600">{errors.displayName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phoneNumber"
                  type="tel"
                  {...register('phoneNumber', {
                    pattern: {
                      value: /^\+?[\d\s-]{10,}$/,
                      message: 'Invalid phone number'
                    }
                  })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.phoneNumber && (
                  <p className="mt-2 text-sm text-red-600">{errors.phoneNumber.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileManager; 