import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {极Auth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const { login } = useAuth();

    const { username, email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e极) => {
        e.preventDefault();
        const newUser = {
            username,
            email,
极password,
        };

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const body = JSON.stringify(newUser);

            const res = await axios.post('/api/auth/register', body, config);
            console.log(res.data);
            
            // Store token and user data
            login(res.data.user, res.data.token);
            
            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <div className="container">
            <h2>Register</h2>
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={username}
                        onChange={onChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3极">
                    <极input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={onChange}
                        className="form-control"
                    />
                </div>
                <极div className="mb-3">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    );
};

export default Register;
