import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { reservationService, Reservation } from '../../services/reservationService';
import { CalendarDays, Clock, Users, MapPin, Eye, X, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './Reservations.module.css';

const Reservations: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const data = await reservationService.getUserReservations(currentUser.uid);
        
        // Sort reservations by date (newest first)
        const sortedReservations = data.sort((a, b) => {
          // First compare by date
          const dateComparison = b.date.getTime() - a.date.getTime();
          if (dateComparison !== 0) return dateComparison;
          
          // If dates are the same, compare by time
          return b.time.localeCompare(a.time);
        });
        
        setReservations(sortedReservations);
      } catch (err) {
        console.error('Error fetching reservations:', err);
        setError('Failed to load your reservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [currentUser]);

  const handleViewDetails = (id: string) => {
    navigate(`/reservation-confirmation/${id}`);
  };

  const handleCancelReservation = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }
    
    try {
      await reservationService.cancelReservation(id);
      
      // Update local state
      setReservations(prevReservations => 
        prevReservations.map(reservation => 
          reservation.id === id 
            ? { ...reservation, status: 'canceled' } 
            : reservation
        )
      );
      
      toast.success('Reservation cancelled successfully');
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      toast.error('Failed to cancel reservation');
    }
  };

  // Format the date for display
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Format the time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return styles.statusConfirmed;
      case 'pending':
        return styles.statusPending;
      case 'canceled':
        return styles.statusCancelled;
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your reservations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className={styles.refreshButton}
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <h3>No Reservations Found</h3>
        <p>You haven't made any reservations yet.</p>
        <button 
          onClick={() => navigate('/reservation')} 
          className={styles.makeReservationButton}
        >
          Make a Reservation
        </button>
      </div>
    );
  }

  return (
    <div className={styles.reservationsContainer}>
      <div className={styles.reservationsHeader}>
        <h2>Your Reservations</h2>
        <button 
          onClick={() => navigate('/reservation')} 
          className={styles.newReservationButton}
        >
          Make a New Reservation
        </button>
      </div>

      <div className={styles.reservationsList}>
        {reservations.map((reservation) => (
          <div 
            key={reservation.id} 
            className={`${styles.reservationCard} ${reservation.status === 'canceled' ? styles.cancelledReservation : ''}`}
          >
            <div className={styles.reservationHeader}>
              <div>
                <h3>Taste Haven</h3>
                <span className={`${styles.statusBadge} ${getStatusBadgeClass(reservation.status)}`}>
                  {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                </span>
              </div>
              <div className={styles.reservationActions}>
                <button 
                  onClick={() => handleViewDetails(reservation.id!)} 
                  className={styles.viewButton}
                  disabled={reservation.status === 'canceled'}
                >
                  <Eye size={16} />
                  Details
                </button>
                {reservation.status !== 'canceled' && (
                  <button 
                    onClick={() => handleCancelReservation(reservation.id!)} 
                    className={styles.cancelButton}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className={styles.reservationDetails}>
              <div className={styles.detailItem}>
                <CalendarDays className={styles.detailIcon} />
                <span>{formatDate(reservation.date)}</span>
              </div>
              <div className={styles.detailItem}>
                <Clock className={styles.detailIcon} />
                <span>{formatTime(reservation.time)}</span>
              </div>
              <div className={styles.detailItem}>
                <Users className={styles.detailIcon} />
                <span>{reservation.guests} {reservation.guests === 1 ? 'Person' : 'People'}</span>
              </div>
              <div className={styles.detailItem}>
                <MapPin className={styles.detailIcon} />
                <span>123 Culinary Avenue, Hyderabad District</span>
              </div>
            </div>

            {reservation.specialRequests && (
              <div className={styles.specialRequests}>
                <p><strong>Special Requests:</strong> {reservation.specialRequests}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reservations; 