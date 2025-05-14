import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { reservationService } from '../services/reservationService';
import { Toaster, toast } from 'react-hot-toast';
import styles from './Reservation.module.css';

const Reservation: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [occasion, setOccasion] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Time slots and occasions
  const timeSlots = [
    '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', 
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];
  
  const occasions = [
    'None', 'Birthday', 'Anniversary', 'Business Meeting', 'Date', 'Other'
  ];
  
  // Prefill user info if available
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.displayName || '');
      setEmail(currentUser.email || '');
    }
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
  }, [currentUser]);
  
  const validateForm = () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    if (!phone.trim() || phone.trim().length < 10) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    
    if (!date) {
      toast.error('Please select a date');
      return false;
    }
    
    if (!time) {
      toast.error('Please select a time');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('You must be logged in to make a reservation');
      navigate('/login');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Check availability first
      const selectedDate = new Date(date);
      const isAvailable = await reservationService.checkAvailability(selectedDate, time);
      
      if (!isAvailable) {
        toast.error('Sorry, this time slot is no longer available. Please choose another time.');
        setLoading(false);
        return;
      }
      
      // Create reservation
      const reservationData = {
        userId: currentUser.uid,
        name,
        email,
        phone,
        date: selectedDate,
        time,
        guests,
        occasion: occasion === 'None' ? undefined : occasion,
        specialRequests: specialRequests.trim() || undefined
      };
      
      const reservationId = await reservationService.createReservation(reservationData);
      
      toast.success('Reservation created successfully!');
      navigate(`/reservation-confirmation/${reservationId}`);
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast.error('Failed to create reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate minimum date (today)
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate maximum date (6 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 6);
  const maxDateStr = maxDate.toISOString().split('T')[0];
  
  return (
    <div className={styles.reservationPage}>
      <Toaster position="top-center" />
      
      <div className={styles.reservationContainer}>
        <h1 className={styles.title}>Make a Reservation</h1>
        <p className={styles.subtitle}>Reserve your table at Taste Haven and enjoy an unforgettable dining experience.</p>
        
        <form onSubmit={handleSubmit} className={styles.reservationForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Your Name" 
              required 
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="your.email@example.com" 
                required 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone</label>
              <input 
                type="tel" 
                id="phone" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="Your Phone Number" 
                required 
              />
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="date">Date</label>
              <input 
                type="date" 
                id="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                min={today} 
                max={maxDateStr}
                required 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="time">Time</label>
              <select 
                id="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
                required
              >
                <option value="">Select Time</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="guests">Number of Guests</label>
              <select 
                id="guests" 
                value={guests} 
                onChange={(e) => setGuests(Number(e.target.value))} 
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                ))}
                <option value="9">9+ (Please specify in special requests)</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="occasion">Occasion (Optional)</label>
              <select 
                id="occasion" 
                value={occasion} 
                onChange={(e) => setOccasion(e.target.value)}
              >
                {occasions.map((occ) => (
                  <option key={occ} value={occ}>{occ}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="specialRequests">Special Requests (Optional)</label>
            <textarea 
              id="specialRequests" 
              value={specialRequests} 
              onChange={(e) => setSpecialRequests(e.target.value)} 
              placeholder="Any special requests, dietary restrictions, or seating preferences?"
              rows={4}
            />
          </div>
          
          <div className={styles.termsConditions}>
            <p>
              By making a reservation, you agree to our reservation policy. 
              We hold reservations for 15 minutes past the scheduled time. 
              Please call us if you're running late.
            </p>
          </div>
          
          <button 
            type="submit" 
            className={styles.submitBtn} 
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm Reservation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reservation; 