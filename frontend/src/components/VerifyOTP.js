import React, { useState } from 'react';
import { verifyotp } from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const VerifyOTP = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await verifyotp({ email, otp });
      setMessage(res.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error(error);
      setMessage('OTP verification failed. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Verify OTP</h2>
      {message && <p className="message">{message}</p>}
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
          <label>OTP:</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Verify</button>
      </form>
    </div>
  );
};

export default VerifyOTP;
