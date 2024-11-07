import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import AddExpenseOrEarning from './components/AddExpense';
import ExpenseTable from './components/ExpenseTable';
import Register from "./components/Register";
import Login from "./components/Login";
import VerifyOTP from './components/VerifyOTP';
import EditExpense from './components/EditExpense';
import Navbar from './components/Navbar';
import './styles.css';

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

const AuthRoute = ({ element }) => {
  return isAuthenticated() ? <Navigate to="/view-expenses" /> : element;
};

// MainLayout to handle routing and conditional navbar
const MainLayout = () => {
  const location = useLocation();

  // Determine if the navbar should be shown based on the current path
  const showNavbar = ['/view-expenses', '/add', '/edit-expense'].some(path => location.pathname.startsWith(path));

  return (
    <div>
      {showNavbar && <Navbar />} {/* Render Navbar conditionally */}
    <div className="container">
      <Routes>
        <Route path="/login" element={<AuthRoute element={<Login />} />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/register" element={<AuthRoute element={<Register />} />} />
        <Route path="/view-expenses" element={<PrivateRoute element={<ExpenseTable />} />} />
        <Route path="/edit-expense/:id" element={<PrivateRoute element={<EditExpense />} />} />
        <Route path="/add" element={<PrivateRoute element={<AddExpenseOrEarning />} />} />
        <Route path="/" element={<AuthRoute element={<Login />} />} />
      </Routes>
    </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
};

export default App;
