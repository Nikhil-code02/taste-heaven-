import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Register.module.css';

interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  preferredLocation: string;
  agreedToTerms: boolean;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { signup, signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    preferredLocation: '',
    agreedToTerms: false
  });

  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Check password matching when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password') {
        setPasswordsMatch(value === formData.confirmPassword || formData.confirmPassword === '');
      } else {
        setPasswordsMatch(value === formData.password);
      }
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Check password match
    if (formData.password !== formData.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    
    // Check password length requirement
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Register the user with Firebase
      await signup(formData.email, formData.password, `${formData.firstName} ${formData.lastName}`);
      
      // Wait a moment to ensure Firebase operations complete
      setTimeout(() => {
      // Navigate to profile page with a query param to show the completion prompt
      navigate('/profile', { state: { newUser: true } });
      }, 1000);
    } catch (error: any) {
      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try logging in instead.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. It should be at least 6 characters.');
      } else {
      setError('Failed to create an account. Please try again.');
      }
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (): Promise<void> => {
    try {
      setError('');
      setLoading(true);
      
      // Sign in with Google
      await signInWithGoogle();
      
      // Navigate to home page
      navigate('/');
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
      console.error('Google sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        {/* Decorative elements */}
        <div className={styles.decorCircle1}></div>
        <div className={styles.decorCircle2}></div>
        
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerPattern} style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`
          }}></div>
          
          <div className={styles.logoContainer}>
            <div className={styles.logoCircle}>
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.1 13.34L2 9.74C2 9.74 2.5 3.5 8.5 3.5C14.5 3.5 15 9.74 15 9.74L8.9 13.34C8.66 13.5 8.34 13.5 8.1 13.34Z" fill="#4CAF50"/>
                <path d="M21.1 15.9L15 12.3V9.74C15 9.74 14.5 3.5 8.5 3.5V3.5C8.33 3.5 8.17 3.5 8 3.51C8.82 2.6 9.89 2 11 2C14 2 16 5.58 16 5.58L21.56 11.14C22.19 11.77 22.19 12.78 21.56 13.41L21.1 13.87C21.46 14.46 21.52 15.23 21.1 15.9Z" fill="#2E7D32"/>
                <path d="M6.17 17.82L12.71 11.28C13.1 10.89 13.1 10.25 12.71 9.86C12.32 9.47 11.69 9.47 11.3 9.86L4.75 16.41C4.75 16.41 4 15.67 4 14.56C4 13.45 4.75 12.7 4.75 12.7L11.3 6.16C12.11 5.36 13.32 5 14.45 5.21C12.94 5.64 11.78 6.96 11.73 8.63C12.73 8.63 13.73 9.11 14.29 9.68L16.31 11.7C17.07 12.46 17.07 13.7 16.31 14.46L9.77 21C9.44 21.32 8.95 21.51 8.43 21.51C7 21.51 6.17 20.03 6.17 20.03V17.82Z" fill="#4CAF50"/>
                <path d="M6.99 21.08C7.47 21.19 8 21.08 8.43 20.77C8.17 20.88 7.89 20.95 7.6 20.95C6.78 20.95 6.12 20.29 6.12 19.47V17.44L5 18.56V20.12C5 20.12 5.9 20.97 6.99 21.08Z" fill="#2E7D32"/>
              </svg>
            </div>
          </div>
          <h1 className={styles.brandName}>Taste Haven</h1>
          <p className={styles.tagline}>Savor the Experience</p>
        </div>
        
        {/* Form */}
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Create an Account</h2>
          
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="firstName" className={styles.inputLabel}>First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter first name"
                  required
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="lastName" className={styles.inputLabel}>Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.inputLabel}>Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="phone" className={styles.inputLabel}>Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter your phone number"
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.inputLabel}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`${styles.input} ${!passwordsMatch ? styles.inputError : ''}`}
                placeholder="Create a password"
                required
              />
              <p className={styles.passwordHint}>
                Password must be at least 8 characters with letters, numbers & symbols
              </p>
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.inputLabel}>Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`${styles.input} ${!passwordsMatch ? styles.inputError : ''}`}
                placeholder="Confirm your password"
                required
              />
              {!passwordsMatch && (
                <p className={styles.passwordError}>Passwords don't match</p>
              )}
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="preferredLocation" className={styles.inputLabel}>Preferred Location</label>
              <select
                id="preferredLocation"
                name="preferredLocation"
                value={formData.preferredLocation}
                onChange={handleInputChange}
                className={styles.select}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`
                }}
                required
              >
                <option value="" disabled>Select your preferred location</option>
                <option value="downtown">Downtown</option>
                <option value="uptown">Uptown</option>
                <option value="midtown">Midtown</option>
                <option value="westside">Westside</option>
                <option value="eastside">Eastside</option>
              </select>
            </div>
            
            <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="agreedToTerms"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleCheckboxChange}
                className={styles.checkbox}
                  required
                />
              <label htmlFor="agreedToTerms" className={styles.termsText}>
                I agree to the <Link to="/terms" className={styles.termsLink}>Terms of Service</Link> and{' '}
                <Link to="/privacy" className={styles.termsLink}>Privacy Policy</Link>.
              </label>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? (
                <span className={styles.buttonSpinner}>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account
                </span>
              ) : 'Create Account'}
            </button>
          </form>
          
          <div className={styles.divider}>
            <div className={styles.dividerLine}></div>
            <span className={styles.dividerText}>OR</span>
            <div className={styles.dividerLine}></div>
          </div>
          
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className={styles.googleButton}
          >
            <svg width="18" height="18" className={styles.googleIcon} xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fillRule="evenodd">
                <path d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.8c-.2 1.1-.8 2-1.8 2.6v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.4z" fill="#4285F4"/>
                <path d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.9v2.3C2.4 15.9 5.5 18 9 18z" fill="#34A853"/>
                <path d="M3.9 10.7c-.2-.6-.3-1.2-.3-1.8 0-.6.1-1.2.3-1.8V4.8H.9C.3 6.2 0 7.8 0 9.5s.3 3.3.9 4.7l3-2.3z" fill="#FBBC05"/>
                <path d="M9 3.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6C13.5.9 11.4 0 9 0 5.5 0 2.4 2.1.9 5.1l3 2.3C4.6 5.2 6.6 3.6 9 3.6z" fill="#EA4335"/>
              </g>
            </svg>
            Continue with Google
          </button>
          
          <div className={styles.loginLink}>
            <p className={styles.loginText}>
              Already have an account?{' '}
              <Link to="/login" className={styles.loginTextLink}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 