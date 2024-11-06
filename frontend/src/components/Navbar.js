import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileInfo from './ProfileInfo'; // Import the new component
import '../styles.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div>
        <Link to="/add">Add Expense/Earning</Link>
        <Link to="/view-expenses">View Expenses</Link>
      </div>
      <div className="profile-section">
        <ProfileInfo />
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
