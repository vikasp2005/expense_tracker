import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles.css';



const Navbar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');  // Remove the token
    navigate('/login');  // Redirect to login page
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



