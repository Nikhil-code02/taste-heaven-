import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Home, Briefcase, Edit, Trash2, Plus, Check, Heart } from 'lucide-react';
import { Address, addressService } from '../../services/addressService';
import { useAuth } from '../../contexts/AuthContext';
import { localStorageService } from '../../services/localStorageService';
import styles from './ProfileComponents.module.css';
import toast from 'react-hot-toast';

// Extend the Address interface to include isFavorite property
interface ExtendedAddress extends Address {
  isFavorite?: boolean;
}

interface AddressFormData {
  label: string;
  name: string;
  phoneNumber: string;
  streetAddress: string;
  apartment: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  instructions: string;
}

const initialFormData: AddressFormData = {
  label: 'Home',
  name: '',
  phoneNumber: '',
  streetAddress: '',
  apartment: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'United States',
  isDefault: false,
  instructions: ''
};

const Addresses: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<ExtendedAddress[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(initialFormData);
  
  const loadAddresses = useCallback(async () => {
    setLoading(true);
    
    try {
      let loadedAddresses: ExtendedAddress[] = [];
      
      if (currentUser) {
        // If user is logged in, get addresses from Firestore
        const userAddresses = await addressService.getUserAddresses(currentUser.uid);
        loadedAddresses = userAddresses as ExtendedAddress[];
      }
      
      // Always check for local addresses
      const localAddresses = localStorageService.getSavedAddresses();
      
      // Merge addresses, preferring cloud ones
      const mergedAddresses = [...loadedAddresses];
      
      // Add any local addresses that don't exist in the cloud
      localAddresses.forEach(localAddr => {
        if (!mergedAddresses.some(addr => addr.id === localAddr.id)) {
          mergedAddresses.push(localAddr);
        }
      });
      
      setAddresses(mergedAddresses);
    } catch (error) {
      console.error('Error loading addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);
  
  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const resetForm = () => {
    setFormData(initialFormData);
    setShowAddForm(false);
    setEditingAddressId(null);
  };
  
  const handleAddressEdit = (address: ExtendedAddress) => {
    setFormData({
      label: address.label,
      name: address.name,
      phoneNumber: address.phoneNumber || '',
      streetAddress: address.streetAddress,
      apartment: address.apartment || '',
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
      instructions: address.instructions || ''
    });
    
    setEditingAddressId(address.id!);
    setShowAddForm(true);
  };
  
  const handleAddressDelete = async (addressId: string) => {
    try {
      if (currentUser) {
        // Delete from Firestore if user is logged in
        await addressService.deleteAddress(currentUser.uid, addressId);
      }
      
      // Always remove from local storage too
      localStorageService.removeAddress(addressId);
      
      // Update state
      setAddresses(prevAddresses => prevAddresses.filter(addr => addr.id !== addressId));
      toast.success('Address deleted successfully');
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };
  
  const handleSetDefault = async (addressId: string) => {
    if (!currentUser) return;
    
    try {
      await addressService.updateAddress(currentUser.uid, addressId, { isDefault: true });
      
      // Update local state
      setAddresses(prevAddresses => 
        prevAddresses.map(addr => ({
          ...addr,
          isDefault: addr.id === addressId
        }))
      );
      
      toast.success('Default address updated');
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to update default address');
    }
  };
  
  const handleToggleFavorite = async (address: ExtendedAddress) => {
    try {
      const isFavorite = !(address.isFavorite);
      
      // Save to local storage
      localStorageService.markAddressAsFavorite(address.id!, isFavorite);
      
      // Update state
      setAddresses(prevAddresses => 
        prevAddresses.map(addr => 
          addr.id === address.id ? { ...addr, isFavorite } : addr
        )
      );
      
      toast.success(isFavorite ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      console.error('Error toggling favorite status:', error);
      toast.error('Failed to update favorite status');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const addressData = {
        label: formData.label,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        streetAddress: formData.streetAddress,
        apartment: formData.apartment,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        isDefault: formData.isDefault,
        instructions: formData.instructions
      };
      
      let addressId: string;
      
      if (editingAddressId) {
        // Update existing address
        if (currentUser) {
          await addressService.updateAddress(currentUser.uid, editingAddressId, addressData);
        }
        
        addressId = editingAddressId;
        
        // Update local state
        setAddresses(prevAddresses => 
          prevAddresses.map(addr => 
            addr.id === editingAddressId 
              ? { ...addr, ...addressData } 
              : addressData.isDefault ? { ...addr, isDefault: false } : addr
          )
        );
      } else {
        // Add new address
        if (currentUser) {
          addressId = await addressService.addAddress(currentUser.uid, addressData);
        } else {
          // Generate a local ID if no user is logged in
          addressId = `local_${Date.now()}`;
        }
        
        // Add to local state
        const newAddress: Address = {
          id: addressId,
          userId: currentUser?.uid || 'local',
          ...addressData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        setAddresses(prevAddresses => {
          const updatedAddresses = addressData.isDefault 
            ? prevAddresses.map(addr => ({ ...addr, isDefault: false }))
            : [...prevAddresses];
            
          return [...updatedAddresses, newAddress];
        });
      }
      
      // Always save to local storage too
      const isFavorite = 'isFavorite' in addressData ? Boolean(addressData.isFavorite) : false;
      localStorageService.saveAddress({ ...addressData, id: addressId, userId: currentUser?.uid || 'local', createdAt: new Date(), updatedAt: new Date() }, isFavorite);
      
      resetForm();
      toast.success(editingAddressId ? 'Address updated successfully' : 'Address added successfully');
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    }
  };
  
  const getAddressIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'home':
        return <Home size={20} />;
      case 'work':
        return <Briefcase size={20} />;
      default:
        return <MapPin size={20} />;
    }
  };
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }
  
  return (
    <div className={styles.addressesContainer}>
      <div className={styles.addressesHeader}>
        <h2 className={styles.sectionTitle}>Your Addresses</h2>
        {!showAddForm && (
          <button 
            onClick={() => setShowAddForm(true)}
            className={styles.addButton}
          >
            <Plus size={16} />
            Add New Address
          </button>
        )}
      </div>
      
      {showAddForm ? (
        <div className={styles.addressForm}>
          <h3>{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="label">Address Label</label>
                <select 
                  id="label" 
                  name="label" 
                  value={formData.label} 
                  onChange={handleChange}
                  required
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="phoneNumber">Phone Number</label>
                <input 
                  type="tel" 
                  id="phoneNumber" 
                  name="phoneNumber" 
                  value={formData.phoneNumber} 
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="streetAddress">Street Address</label>
              <input 
                type="text" 
                id="streetAddress" 
                name="streetAddress" 
                value={formData.streetAddress} 
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="apartment">Apartment, Suite, etc. (optional)</label>
              <input 
                type="text" 
                id="apartment" 
                name="apartment" 
                value={formData.apartment} 
                onChange={handleChange}
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="city">City</label>
                <input 
                  type="text" 
                  id="city" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="state">State</label>
                <input 
                  type="text" 
                  id="state" 
                  name="state" 
                  value={formData.state} 
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="postalCode">Postal Code</label>
                <input 
                  type="text" 
                  id="postalCode" 
                  name="postalCode" 
                  value={formData.postalCode} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="country">Country</label>
                <input 
                  type="text" 
                  id="country" 
                  name="country" 
                  value={formData.country} 
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="instructions">Delivery Instructions (optional)</label>
              <textarea 
                id="instructions" 
                name="instructions" 
                value={formData.instructions} 
                onChange={handleChange}
                rows={2}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  name="isDefault" 
                  checked={formData.isDefault} 
                  onChange={handleCheckboxChange}
                />
                Set as default address
              </label>
            </div>
            
            <div className={styles.formActions}>
              <button 
                type="button" 
                onClick={resetForm}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={styles.submitButton}
              >
                {editingAddressId ? 'Update Address' : 'Add Address'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {addresses.length === 0 ? (
            <div className={styles.emptyState}>
              <MapPin size={48} className={styles.emptyIcon} />
              <p>You haven't added any addresses yet.</p>
              <button 
                onClick={() => setShowAddForm(true)}
                className={styles.actionButton}
              >
                <Plus size={16} />
                Add an Address
              </button>
            </div>
          ) : (
            <div className={styles.addressesList}>
              {addresses.map((address) => (
                <div key={address.id} className={styles.addressCard}>
                  <div className={styles.addressIcon}>
                    {getAddressIcon(address.label)}
                  </div>
                  <div className={styles.addressContent}>
                    <div className={styles.addressHeader}>
                      <h3>{address.label}</h3>
                      {address.isDefault && (
                        <span className={styles.defaultBadge}>
                          <Check size={12} />
                          Default
                        </span>
                      )}
                    </div>
                    <p className={styles.addressName}>{address.name}</p>
                    <p className={styles.addressLine}>
                      {address.streetAddress}{address.apartment ? `, ${address.apartment}` : ''}
                    </p>
                    <p className={styles.addressLine}>
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className={styles.addressLine}>{address.country}</p>
                    {address.phoneNumber && (
                      <p className={styles.addressPhone}>{address.phoneNumber}</p>
                    )}
                    {address.instructions && (
                      <p className={styles.addressInstructions}>{address.instructions}</p>
                    )}
                  </div>
                  <div className={styles.addressActions}>
                    <button 
                      onClick={() => handleAddressEdit(address)}
                      className={styles.editButton}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleAddressDelete(address.id!)}
                      className={styles.deleteButton}
                    >
                      <Trash2 size={16} />
                    </button>
                    {!address.isDefault && (
                      <button 
                        onClick={() => handleSetDefault(address.id!)}
                        className={styles.defaultButton}
                      >
                        Set as Default
                      </button>
                    )}
                    <button 
                      onClick={() => handleToggleFavorite(address)}
                      className={`${styles.favoriteButton} ${address.isFavorite ?? false ? styles.favorited : ''}`}
                      title={(address.isFavorite ?? false) ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart 
                        size={16} 
                        fill={(address.isFavorite ?? false) ? "#e53e3e" : "none"} 
                        stroke={(address.isFavorite ?? false) ? "#e53e3e" : "#4a5568"} 
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Addresses; 