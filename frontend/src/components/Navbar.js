import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div>
        <Link to="/add">Add Expense/Earning</Link>
        <Link to="/view-expenses">View Expenses</Link>
      </div>
    </nav>
  );
};

export default Navbar;
