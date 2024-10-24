import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddExpenseOrEarning from './components/AddExpense';
import ExpenseTable from './components/ExpenseTable';
import Register from "./components/Register";
import EditExpense from './components/EditExpense';
import Navbar from './components/Navbar';
import './styles.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/add" element={<AddExpenseOrEarning />} />
          <Route path="/register" element={<Register />} />
          <Route path="/view-expenses" element={<ExpenseTable />} />
          <Route path="/edit-expense/:id" element={<EditExpense />} />
          <Route path="/" element={<AddExpenseOrEarning />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
