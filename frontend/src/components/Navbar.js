import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token and user-specific data from local storage
    localStorage.clear();
    sessionStorage.clear();

    

    // Navigate to login page
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div>
        <Link to="/add">Add Expense/Earning</Link>
        <Link to="/view-expenses">View Expenses</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
