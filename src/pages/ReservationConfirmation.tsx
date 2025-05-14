import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { reservationService, Reservation } from '../services/reservationService';
import { CalendarDays, Clock, Users, CheckCircle, MapPin } from 'lucide-react';
import styles from './ReservationConfirmation.module.css';

const ReservationConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        if (!id) {
          setError('Reservation ID not found');
          setLoading(false);
          return;
        }
        
        const data = await reservationService.getReservationById(id);
        
        if (!data) {
          setError('Reservation not found');
        } else {
          setReservation(data);
        }
      } catch (err) {
        console.error('Error fetching reservation:', err);
        setError('Failed to load reservation details');
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your reservation details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/reservation" className={styles.returnBtn}>
          Make a New Reservation
        </Link>
      </div>
    );
  }

  // Format the date for display
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
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

  return (
    <div className={styles.confirmationPage}>
      <div className={styles.confirmationCard}>
        <div className={styles.confirmationHeader}>
          <CheckCircle size={40} className={styles.checkIcon} />
          <h1>Reservation Confirmed!</h1>
          <p>Your table has been reserved successfully.</p>
        </div>

        <div className={styles.reservationDetails}>
          <div className={styles.detailItem}>
            <CalendarDays className={styles.detailIcon} />
            <div>
              <span className={styles.detailLabel}>Date</span>
              <span className={styles.detailValue}>
                {reservation?.date ? formatDate(reservation.date) : 'N/A'}
              </span>
            </div>
          </div>

          <div className={styles.detailItem}>
            <Clock className={styles.detailIcon} />
            <div>
              <span className={styles.detailLabel}>Time</span>
              <span className={styles.detailValue}>
                {reservation?.time ? formatTime(reservation.time) : 'N/A'}
              </span>
            </div>
          </div>

          <div className={styles.detailItem}>
            <Users className={styles.detailIcon} />
            <div>
              <span className={styles.detailLabel}>Party Size</span>
              <span className={styles.detailValue}>
                {reservation?.guests} {reservation?.guests === 1 ? 'Person' : 'People'}
              </span>
            </div>
          </div>

          <div className={styles.detailItem}>
            <MapPin className={styles.detailIcon} />
            <div>
              <span className={styles.detailLabel}>Location</span>
              <span className={styles.detailValue}>
                Taste Haven, 123 Culinary Avenue, Hyderabad District
              </span>
            </div>
          </div>

          {reservation?.occasion && (
            <div className={styles.specialNote}>
              <span className={styles.detailLabel}>Special Occasion:</span>
              <span className={styles.detailValue}>{reservation.occasion}</span>
            </div>
          )}

          {reservation?.specialRequests && (
            <div className={styles.specialNote}>
              <span className={styles.detailLabel}>Special Requests:</span>
              <p className={styles.detailValue}>{reservation.specialRequests}</p>
            </div>
          )}

          <div className={styles.confirmationId}>
            <span className={styles.detailLabel}>Confirmation ID:</span>
            <span className={styles.detailValue}>{id}</span>
          </div>
        </div>

        <div className={styles.confirmationFooter}>
          <p className={styles.confirmationNote}>
            We've sent a confirmation email to <strong>{reservation?.email}</strong>. 
            Please arrive 10 minutes before your reservation time.
          </p>

          <p className={styles.contactInfo}>
            If you need to modify or cancel your reservation, please contact us at 
            <strong> info@tastehaven.com</strong> or <strong>123-4567</strong>.
          </p>

          <div className={styles.actions}>
            <Link to="/" className={styles.homeBtn}>
              Return to Home
            </Link>
            
            <Link to="/profile" className={styles.viewBtn}>
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationConfirmation; 