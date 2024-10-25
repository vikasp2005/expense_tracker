import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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

const App = () => {
  
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/register" element={<AuthRoute element={<Register />} />} />
          <Route path="/login" element={<AuthRoute element={<Login />} />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/view-expenses" element={<PrivateRoute element={<ExpenseTable />} />} />
          <Route path="/edit-expense/:id" element={<PrivateRoute element={<EditExpense />} />} />
          <Route path="/add" element={<PrivateRoute element={<AddExpenseOrEarning />} />} />
          <Route path="/" element={<AuthRoute element={<Login />} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
