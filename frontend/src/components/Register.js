import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from "../api";
import '../styles.css'; // Import the CSS file for styles

const Register = () => {
  const [name, setName] = useState('');
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
    if (!name || !email || !password) {
      setError('All fields are required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
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
      await register({ name, email, password });
      setLoading(false);
      navigate('/verify-otp');
    } catch (err) {
      console.error(err);
      setError('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      {loading && <div className="loading-popup">Loading...</div>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <button type="submit" className="submit-button">Register</button>
      </form>
      <p>Already have an account? <button onClick={() => navigate('/login')} className="link-button">Login here</button></p>
    </div>
  );
};

export default Register;
