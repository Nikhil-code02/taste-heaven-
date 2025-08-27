 import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const { login } = useAuth();

    const { email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        const user = {
            email,
            password,
        };

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const body = JSON.stringify(user);
            console.log('Login: Sending request to /api/auth/login with:', body);

            const res = await axios.post('/api/auth/login', body, config);
            console.log('Login: Response received:', res.data);
            
            if (res.data && res.data.token && res.data.user) {
                // Store token and user data
                login(res.data.user, res.data.token);
                
                // Redirect to dashboard
                navigate('/dashboard');
            } else {
                console.error('Login: Invalid response format - missing token or user data');
            }
        } catch (err) {
            console.error('Login: Error occurred:', err);
            if (err.response) {
                console.error('Login: Response error:', err.response.data);
            }
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={onChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};

export default Login;
