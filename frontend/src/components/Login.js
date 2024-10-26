import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles.css'; // Import the CSS file for styles

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      // If the user is already logged in, redirect to the protected page
      navigate('/view-expenses');
    }
  }, [navigate]);

  const validateForm = () => {
    if (!email || !password) {
      setError('All fields are required');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await axios.post('https://expense-tracker-backend-kjza.onrender.com/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setLoading(false);
      navigate('/view-expenses');
    } catch (err) {
      console.error(err);
      setError('Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      {loading && <div className="loading-popup">Loading...</div>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Login</button>
      </form>
      <p>Don't have an account? <button onClick={() => navigate('/register')} className="link-button">Register here</button></p>
    </div>
  );
};

export default Login;
