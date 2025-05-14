import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Create a CSS string for the animation
const loginStyles = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }

  .login-btn::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
  }
  
  .login-btn:hover::after {
    left: 100%;
  }
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Add the CSS to the document head
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = loginStyles;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#333',
      fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        background: 'white',
        width: '400px',
        borderRadius: '15px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Decorative elements */}
        <div style={{
          content: '""',
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'rgba(76, 175, 80, 0.1)',
          zIndex: 0
        }}></div>
        
        <div style={{
          content: '""',
          position: 'absolute',
          bottom: '-50px',
          left: '-50px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'rgba(33, 150, 243, 0.1)',
          zIndex: 0
        }}></div>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #2c3e50 0%, #4a6572 100%)',
          padding: '30px 0',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            opacity: 0.3
          }}></div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '15px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: '#fff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
              zIndex: 1,
              position: 'relative',
              animation: 'float 6s ease-in-out infinite'
            }}>
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.1 13.34L2 9.74C2 9.74 2.5 3.5 8.5 3.5C14.5 3.5 15 9.74 15 9.74L8.9 13.34C8.66 13.5 8.34 13.5 8.1 13.34Z" fill="#4CAF50"/>
                <path d="M21.1 15.9L15 12.3V9.74C15 9.74 14.5 3.5 8.5 3.5V3.5C8.33 3.5 8.17 3.5 8 3.51C8.82 2.6 9.89 2 11 2C14 2 16 5.58 16 5.58L21.56 11.14C22.19 11.77 22.19 12.78 21.56 13.41L21.1 13.87C21.46 14.46 21.52 15.23 21.1 15.9Z" fill="#2E7D32"/>
                <path d="M6.17 17.82L12.71 11.28C13.1 10.89 13.1 10.25 12.71 9.86C12.32 9.47 11.69 9.47 11.3 9.86L4.75 16.41C4.75 16.41 4 15.67 4 14.56C4 13.45 4.75 12.7 4.75 12.7L11.3 6.16C12.11 5.36 13.32 5 14.45 5.21C12.94 5.64 11.78 6.96 11.73 8.63C12.73 8.63 13.73 9.11 14.29 9.68L16.31 11.7C17.07 12.46 17.07 13.7 16.31 14.46L9.77 21C9.44 21.32 8.95 21.51 8.43 21.51C7 21.51 6.17 20.03 6.17 20.03V17.82Z" fill="#4CAF50"/>
                <path d="M6.99 21.08C7.47 21.19 8 21.08 8.43 20.77C8.17 20.88 7.89 20.95 7.6 20.95C6.78 20.95 6.12 20.29 6.12 19.47V17.44L5 18.56V20.12C5 20.12 5.9 20.97 6.99 21.08Z" fill="#2E7D32"/>
              </svg>
            </div>
          </div>
          
          <h1 style={{
            color: 'white',
            fontSize: '28px',
            fontWeight: 600,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            marginBottom: '5px',
            position: 'relative',
            zIndex: 1
          }}>Taste Haven</h1>
          
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            marginTop: '5px',
            fontWeight: 300,
            position: 'relative',
            zIndex: 1,
            letterSpacing: '1px'
          }}>Savor the Experience</p>
        </div>
        
        {/* Form Container */}
        <div style={{
          padding: '30px'
        }}>
          {error && (
            <div style={{
              padding: '10px 15px',
              background: '#FFEBEE',
              color: '#D32F2F',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div style={{
              marginBottom: '20px'
            }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 500,
                color: '#555'
              }} htmlFor="email">
                Email Address
              </label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                required
                style={{
                  width: '100%',
                  padding: '14px 15px',
                  border: '1px solid #e1e1e1',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#f9f9f9'
                }}
              />
            </div>
            
            <div style={{
              marginBottom: '20px'
            }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 500,
                color: '#555'
              }} htmlFor="password">
                Password
              </label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password" 
                required
                style={{
                  width: '100%',
                  padding: '14px 15px',
                  border: '1px solid #e1e1e1',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#f9f9f9'
                }}
              />
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                margin: '15px 0'
              }}>
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    marginRight: '8px'
                  }}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              
              <div style={{
                textAlign: 'right'
              }}>
                <Link to="/forgot-password" style={{
                  color: '#ff7e5f',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}>
                  Forgot password?
                </Link>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="login-btn"
              style={{
                background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
                color: 'white',
                border: 'none',
                padding: '16px',
                borderRadius: '8px',
                width: '100%',
                fontSize: '16px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                marginTop: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Signing in...' : 'Log In'}
            </button>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              textAlign: 'center',
              margin: '20px 0'
            }}>
              <div style={{
                flex: 1,
                borderBottom: '1px solid #ddd'
              }}></div>
              <span style={{
                padding: '0 10px',
                color: '#777',
                fontSize: '14px'
              }}>OR</span>
              <div style={{
                flex: 1,
                borderBottom: '1px solid #ddd'
              }}></div>
            </div>
            
            <button 
              type="button" 
              onClick={handleGoogleSignIn}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e0e0e0',
                padding: '14px',
                borderRadius: '8px',
                background: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: 500,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
                opacity: loading ? 0.7 : 1
              }}
            >
              <span style={{
                marginRight: '12px'
              }}>
                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                  <g fill="none" fillRule="evenodd">
                    <path d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.8c-.2 1.1-.8 2-1.8 2.6v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.4z" fill="#4285F4"/>
                    <path d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.9v2.3C2.4 15.9 5.5 18 9 18z" fill="#34A853"/>
                    <path d="M3.9 10.7c-.2-.6-.3-1.2-.3-1.8 0-.6.1-1.2.3-1.8V4.8H.9C.3 6.2 0 7.8 0 9.5s.3 3.3.9 4.7l3-2.3z" fill="#FBBC05"/>
                    <path d="M9 3.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6C13.5.9 11.4 0 9 0 5.5 0 2.4 2.1.9 5.1l3 2.3C4.6 5.2 6.6 3.6 9 3.6z" fill="#EA4335"/>
                  </g>
                </svg>
              </span>
              Continue with Google
            </button>
          </form>
          
          <div style={{
            textAlign: 'center',
            marginTop: '25px',
            color: '#777',
            fontSize: '14px',
            paddingBottom: '5px'
          }}>
            <p>Don't have an account? <Link to="/register" style={{
              color: '#4CAF50',
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'all 0.3s ease'
            }}>Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 