import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import styles from './Contact.module.css';
import toast from 'react-hot-toast';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Thank you for your message! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.contactPage}>
      <div className={styles.contactHeader}>
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Get in touch with us!</p>
      </div>
      
      <div className={styles.contactContainer}>
        <div className={styles.contactInfo}>
          <h2>Get In Touch</h2>
          <p>
            We welcome your questions, feedback, and reservation inquiries. 
            Our team is ready to assist you and ensure you have an exceptional dining experience.
          </p>
          
          <div className={styles.infoItem}>
            <MapPin className={styles.icon} />
            <div>
              <h3>Our Location</h3>
              <p>123 Culinary Avenue, Hyderabad District</p>
            </div>
          </div>
          
          <div className={styles.infoItem}>
            <Phone className={styles.icon} />
            <div>
              <h3>Phone Number</h3>
              <p>+91 123-456-7890</p>
            </div>
          </div>
          
          <div className={styles.infoItem}>
            <Mail className={styles.icon} />
            <div>
              <h3>Email Address</h3>
              <p>info@tastehaven.com</p>
            </div>
          </div>
          
          <div className={styles.infoItem}>
            <Clock className={styles.icon} />
            <div>
              <h3>Opening Hours</h3>
              <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
              <p>Saturday - Sunday: 10:00 AM - 11:00 PM</p>
            </div>
          </div>
          
          <div className={styles.map}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647.3413671555!2d78.24323045!3d17.4123125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1621525788092!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
              title="Restaurant Location"
            ></iframe>
          </div>
        </div>
        
        <div className={styles.contactForm}>
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Your email address"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number (optional)"
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select a subject</option>
                <option value="reservation">Reservation Inquiry</option>
                <option value="feedback">Feedback</option>
                <option value="catering">Catering Services</option>
                <option value="careers">Careers</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Your message"
                rows={6}
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <span className={styles.loading}>Sending...</span>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact; 