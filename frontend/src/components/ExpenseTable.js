import React, { useEffect, useState, useCallback } from 'react';
import { fetchExpenses, deleteExpense } from '../api';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import '../styles.css';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const ExpenseTable = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [error, setError] = useState('');
  const [deletePopup, setDeletePopup] = useState(false);
  const [confirmDeletePopup, setConfirmDeletePopup] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  // Filter states
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [period, setPeriod] = useState('All'); // New state for period selection

  const navigate = useNavigate();

  // Function to calculate start and end dates based on the period
  const calculatePeriodDates = (selectedPeriod) => {
    const currentDate = new Date();
    let start = '';
    let end = formatDate(currentDate); // End date is today by default

    switch (selectedPeriod) {
      case 'Last week':
        start = formatDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
        break;
      case 'Last month':
        start = formatDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
        break;
      case 'Last 2 months':
        start = formatDate(new Date(currentDate.setMonth(currentDate.getMonth() - 2)));
        break;
      case 'Last 6 months':
        start = formatDate(new Date(currentDate.setMonth(currentDate.getMonth() - 6)));
        break;
      case 'Last year':
        start = formatDate(new Date(currentDate.setFullYear(currentDate.getFullYear() - 1)));
        break;
      default:
        start = '';
        end = '';
        break;
    }

    setStartDate(start);
    setEndDate(end);
  };

  // Fetch expenses with filters (using useCallback)
  const fetchFilteredExpenses = useCallback(async () => {
    try {
      const response = await fetchExpenses({
        type: typeFilter,
        category: categoryFilter,
        minAmount,
        maxAmount,
        startDate,
        endDate
      });
      setExpenses(response.expenses);

      // Calculate totals
      let totalExp = 0;
      let totalEarn = 0;
      response.expenses.forEach(expense => {
        if (expense.type === 'Expense') {
          totalExp += expense.amount;
        } else if (expense.type === 'Earning') {
          totalEarn += expense.amount;
        }
      });

      setTotalExpenses(totalExp);
      setTotalEarnings(totalEarn);
      setTotalSavings(totalEarn - totalExp);
    } catch (err) {
      console.error(err);
      setError('Failed to load expenses');
    }
  }, [typeFilter, categoryFilter, minAmount, maxAmount, startDate, endDate]);

  // When the period changes, calculate start and end dates
  useEffect(() => {
    if (period !== 'Custom') {
      calculatePeriodDates(period); // Automatically calculate dates for selected period
    }
  }, [period]); // Triggered when the period changes

  useEffect(() => {
    fetchFilteredExpenses();
  }, [fetchFilteredExpenses]);

  const handleDelete = async () => {
    try {
      await deleteExpense(expenseToDelete._id);
      setExpenses(expenses.filter(exp => exp._id !== expenseToDelete._id));
      fetchFilteredExpenses(); // Refresh data after deletion

      setDeletePopup(false); // Close the confirmation popup
      setConfirmDeletePopup(true); // Show the "Deleted successfully" popup
    } catch (err) {
      setError('Failed to delete expense');
    }
  };

  const confirmDelete = (expense) => {
    setExpenseToDelete(expense);
    setDeletePopup(true);
  };

  const closeDeletePopup = () => {
    setDeletePopup(false);
  };

  const closeConfirmDeletePopup = () => {
    setConfirmDeletePopup(false);
    setExpenseToDelete(null);
  };

  const handleEdit = (id) => {
    navigate(`/edit-expense/${id}`);
  };

  return (
    <div className={deletePopup}>
      <div className="card">
        <h2>Expense List</h2>
        {error && <p className="error-message">{error}</p>}

        <div className="totals">
          <p className="total-amount">Total Expenses: Rs.{totalExpenses}</p>
          <p className="total-earnings">Total Earnings: Rs.{totalEarnings}</p>
          <p className="total-savings">Total Savings: Rs.{totalSavings}</p>
        </div>

        {/* Filters */}
        <div className="filters">
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="All">All</option>
            <option value="Last week">Last week</option>
            <option value="Last month">Last month</option>
            <option value="Last 2 months">Last 2 months</option>
            <option value="Last 6 months">Last 6 months</option>
            <option value="Last year">Last year</option>
            <option value="Custom">Custom</option>
          </select>

          {period === 'Custom' && (
            <>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </>
          )}

          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            <option value="Expense">Expense</option>
            <option value="Earning">Earning</option>
          </select>

          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health">Health</option>
            <option value="Other">Other</option>
            <option value="Salary">Salary</option>
          </select>

          <input
            type="number"
            placeholder="Min Amount"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Amount"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
          />
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Type</th>
              <th>Category</th>
              <th>Description</th>
              <th>Date</th>
              <th>Added On</th>
              <th>Last Modified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 ? (
              expenses.map(expense => (
                <tr key={expense._id}>
                  <td>Rs.{expense.amount}</td>
                  <td>{expense.type}</td>
                  <td>{expense.category}</td>
                  <td>{expense.desc}</td>
                  <td>{formatDate(expense.date)}</td>
                  <td>{formatDate(expense.added_on)}</td>
                  <td>{formatDate(expense.last_modified_at)}</td>
                  <td>
                    <FiEdit
                      className = "btn2"
                      onClick={() => handleEdit(expense._id)}
                    />
                      
                    <MdDelete 
                      className = "btn2"
                      onClick={() => confirmDelete(expense)}
                      />
                      
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No expenses found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deletePopup && expenseToDelete && (
        <div className="popup">
          <div className="popup-content">
            <p>Are you sure you want to delete this expense?</p>
            <p><strong>Amount:</strong> Rs.{expenseToDelete.amount}</p>
            <p><strong>Type:</strong> {expenseToDelete.type}</p>
            <p><strong>Category:</strong> {expenseToDelete.category}</p>
            <p><strong>Description:</strong> {expenseToDelete.desc || "NULL"}</p>
            <button className="confirm-btn" onClick={handleDelete}>Yes</button>
            <button className="cancel-btn" onClick={closeDeletePopup}>No</button>
          </div>
        </div>
      )}

      {confirmDeletePopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Expense deleted successfully!</p>
            <button className="confirm-btn" onClick={closeConfirmDeletePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;
