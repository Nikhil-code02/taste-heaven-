import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService, UserProfile } from '../services/authService';
import { Settings, MapPin, User, Star, Clock, CreditCard, Edit, LogOut, Calendar } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';

// Import the new components
import Favorites from '../components/profile/Favorites';
import Orders from '../components/profile/Orders';
import Addresses from '../components/profile/Addresses';
import Payment from '../components/profile/Payment';
import Reservations from '../components/profile/Reservations';

// Define interfaces for missing types
interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
}

interface Order {
  id: number;
  restaurant: string;
  date: string;
  total: number;
  status: string;
}

interface Address {
  id: number;
  label: string;
  address: string;
}

interface PaymentMethod {
  id: number;
  type: string;
  last4: string;
  default: boolean;
}

// Extended user profile with additional fields
interface ExtendedUserProfile extends UserProfile {
  favoriteRestaurants?: Restaurant[];
  recentOrders?: Order[];
  savedAddresses?: Address[];
  paymentMethods?: PaymentMethod[];
  ordersCompleted?: number;
}

const Profile = () => {
  const { username } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [userData, setUserData] = useState<ExtendedUserProfile | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [foodPreferences, setFoodPreferences] = useState<string[]>([]);
  
  // Form fields for profile editing
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [displayName, setDisplayName] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [phoneNumber, setPhoneNumber] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [address, setAddress] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bio, setBio] = useState('');
  
  // Check if user just registered (for showing completion prompt)
  const isNewUser = location.state?.newUser;

  // Load user profile data
  useEffect(() => {
    if (!initialLoad && !currentUser) {
      navigate('/login');
      return;
    }
    
    const loadProfile = async () => {
      try {
        setLoading(true);
        
        // If a username is provided, load that user's profile
        // Otherwise load the current user's profile
        const uid = username || currentUser?.uid;
        
        if (!uid) {
          console.log('No user ID available');
          setLoading(false);
          toast.error('User not found. Please log in.');
          navigate('/login');
          return;
        }
        
        console.log('Loading profile for user:', uid);
        const userProfile = await authService.getUserProfile(uid);
        
        if (userProfile) {
          console.log('Profile loaded successfully:', userProfile.displayName);
          // Create extended profile with additional fields
          const extendedProfile: ExtendedUserProfile = {
            ...userProfile,
            favoriteRestaurants: [],
            recentOrders: [],
            savedAddresses: userProfile.address ? 
              [{ id: 1, label: 'Home', address: userProfile.address }] : 
              [],
            ordersCompleted: 0
          };
          
          setUserData(extendedProfile);
          setDisplayName(userProfile.displayName || '');
          setPhoneNumber(userProfile.phoneNumber || '');
          setAddress(userProfile.address || '');
          setBio(userProfile.bio || '');
          setFoodPreferences(userProfile.foodPreferences || []);
        } else {
          console.log('Profile not found');
          toast.error('User profile not found');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    loadProfile();
  }, [username, currentUser, isNewUser, navigate, initialLoad]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  const [activeTab, setActiveTab] = useState('profile');

  const renderTabContent = () => {
    if (!userData) return null;
    
    switch(activeTab) {
      case 'profile':
        return (
          <div>
            <div className={styles.profileCard}>
              <div className={styles.userInfo}>
                <div className={styles.avatarContainer}>
                  {userData?.photoURL ? (
                    <img src={userData.photoURL} alt="Profile" className={styles.avatar} />
                  ) : (
                    <div className={styles.defaultAvatar}>
                      {userData.displayName?.charAt(0) || userData.email?.charAt(0) || '?'}
                    </div>
                  )}
                  <button className={styles.editAvatar}>
                    <Edit size={12} />
                  </button>
                </div>
                <div className={styles.userDetails}>
                  <h2>{userData?.displayName || 'Restaurant User'}</h2>
                  <p>{userData?.email || ''}</p>
                  <p>{userData?.phoneNumber || ''}</p>
                </div>
              </div>
            </div>
            
            <div className={styles.profileCard}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Account Details</h3>
                <button 
                  onClick={() => navigate('/profile/edit')}
                  className={styles.editButton}
                >
                  <Edit size={16} />
                  Edit
                </button>
              </div>
              <div className={styles.infoRow}>
                <p className={styles.infoLabel}>Joined</p>
                <p className={styles.infoValue}>
                  {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Recently'}
                </p>
              </div>
              <div className={styles.infoRow}>
                <p className={styles.infoLabel}>Orders Completed</p>
                <p className={styles.infoValue}>{userData?.ordersCompleted || 0}</p>
              </div>
              <div>
                <p className={styles.infoLabel}>Food Preferences</p>
                <div style={{ marginTop: '0.5rem' }}>
                  {userData?.foodPreferences && userData.foodPreferences.length > 0 ? (
                    userData.foodPreferences.map((preference, index) => (
                      <span key={index} className={`${styles.tag} ${styles.foodPreference}`}>
                        {preference}
                      </span>
                    ))
                  ) : (
                    <p style={{ color: '#999', fontSize: '0.875rem' }}>No preferences set</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className={styles.profileCard}>
              <h3 className={styles.sectionTitle}>Notifications</h3>
              <div className={styles.switchContainer}>
                <p className={styles.switchLabel}>Order Status Updates</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>
              <div className={styles.switchContainer}>
                <p className={styles.switchLabel}>Special Offers</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>
              <div className={styles.switchContainer}>
                <p className={styles.switchLabel}>Email Newsletter</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>
            </div>
          </div>
        );
      
      case 'favorites':
        return <Favorites />;
      
      case 'orders':
        return <Orders />;
      
      case 'reservations':
        return <Reservations />;
      
      case 'addresses':
        return <Addresses />;
      
      case 'payment':
        return <Payment />;
      
      case 'settings':
        return (
          <div className={styles.profileCard}>
            <h3 className={styles.sectionTitle}>Account Settings</h3>
            <div className="rounded-lg divide-y">
              <div className="p-4 flex justify-between items-center">
                <span>Change Password</span>
                <Edit size={16} className="text-gray-400" />
              </div>
              <div className="p-4 flex justify-between items-center">
                <span>Privacy Settings</span>
                <Edit size={16} className="text-gray-400" />
              </div>
              <div className="p-4 flex justify-between items-center">
                <span>Language</span>
                <div className="flex items-center">
                  <span className="mr-2 text-gray-600">English</span>
                  <Edit size={16} className="text-gray-400" />
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span>Dark Mode</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className={`${styles.actionButton} ${styles.dangerButton} ${styles.fullWidthButton}`}
              style={{ marginTop: '1.5rem' }}
            >
              <LogOut size={16} />
              Log Out
            </button>
          </div>
        );
      
      default:
        return <div>Profile Content</div>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // Make sure we have user data before trying to use it
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
    <div className={styles.profilePage}>
      <Toaster position="top-center" />
      
      <div className={styles.profileHeader}>
        <h1>My Profile</h1>
      </div>
      
      <div className={styles.tabContainer}>
        <div className={styles.tabs}>
          <div 
            className={`${styles.tab} ${activeTab === 'profile' ? styles.active : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'favorites' ? styles.active : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'orders' ? styles.active : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'reservations' ? styles.active : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            Reservations
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'addresses' ? styles.active : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            Addresses
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'payment' ? styles.active : ''}`}
            onClick={() => setActiveTab('payment')}
          >
            Payment
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </div>
        </div>
      </div>
      
      <div>
        {renderTabContent()}
      </div>
      
      {/* Mobile Navigation */}
      <div className={styles.mobileNav}>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`${styles.navButton} ${activeTab === 'profile' ? styles.active : ''}`}
        >
          <User size={20} />
          <span>Profile</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('favorites')}
          className={`${styles.navButton} ${activeTab === 'favorites' ? styles.active : ''}`}
        >
          <Star size={20} />
          <span>Favorites</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('orders')}
          className={`${styles.navButton} ${activeTab === 'orders' ? styles.active : ''}`}
        >
          <Clock size={20} />
          <span>Orders</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('reservations')}
          className={`${styles.navButton} ${activeTab === 'reservations' ? styles.active : ''}`}
        >
          <Calendar size={20} />
          <span>Reservations</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('addresses')}
          className={`${styles.navButton} ${activeTab === 'addresses' ? styles.active : ''}`}
        >
          <MapPin size={20} />
          <span>Addresses</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('payment')}
          className={`${styles.navButton} ${activeTab === 'payment' ? styles.active : ''}`}
        >
          <CreditCard size={20} />
          <span>Payment</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('settings')}
          className={`${styles.navButton} ${activeTab === 'settings' ? styles.active : ''}`}
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;