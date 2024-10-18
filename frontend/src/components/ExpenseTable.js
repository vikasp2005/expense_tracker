import React, { useEffect, useState } from 'react';
import { fetchExpenses, deleteExpense } from '../api';
import { useNavigate } from 'react-router-dom';
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
  const [deletePopup, setDeletePopup] = useState(false); // Popup for delete confirmation
  const [confirmDeletePopup, setConfirmDeletePopup] = useState(false); // Popup after successful delete
  const [expenseToDelete, setExpenseToDelete] = useState(null); // Track which expense to delete
  const navigate = useNavigate();

  useEffect(() => {
    const getExpenses = async () => {
      try {
        const response = await fetchExpenses();
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
    };
    getExpenses();
  }, []); // Empty dependency array to fetch data on initial load

  const handleDelete = async () => {
    try {
      await deleteExpense(expenseToDelete._id);
      setExpenses(expenses.filter(exp => exp._id !== expenseToDelete._id));

      // Update the totals after deletion
      const updatedExpenses = expenses.filter(exp => exp._id !== expenseToDelete._id);
      let totalExp = 0;
      let totalEarn = 0;
      updatedExpenses.forEach(expense => {
        if (expense.type === 'Expense') {
          totalExp += expense.amount;
        } else if (expense.type === 'Earning') {
          totalEarn += expense.amount;
        }
      });

      setTotalExpenses(totalExp);
      setTotalEarnings(totalEarn);
      setTotalSavings(totalEarn - totalExp);

      setDeletePopup(false); // Close the confirmation popup
      setConfirmDeletePopup(true); // Show the "Deleted successfully" popup
    } catch (err) {
      setError('Failed to delete expense');
    }
  };

  const confirmDelete = (expense) => {
    setExpenseToDelete(expense); // Set the expense to delete
    setDeletePopup(true); // Show delete confirmation popup
  };

  const closeDeletePopup = () => {
    setDeletePopup(false); // Close delete confirmation popup
  };

  const closeConfirmDeletePopup = () => {
    setConfirmDeletePopup(false); // Close success popup
    setExpenseToDelete(null); // Clear the deleted expense details
  };

  const handleEdit = (id) => {
    navigate(`/edit-expense/${id}`);
  };

  return (
    <div className={deletePopup}> {/* Add  to background */}
      <div className="card">
        <h2>Expense List</h2>
        {error && <p className="error-message">{error}</p>}

        <div className="totals">
          <p className="total-amount">Total Expenses: Rs.{totalExpenses}</p>
          <p className="total-earnings">Total Earnings: Rs.{totalEarnings}</p>
          <p className="total-savings">Total Savings: Rs.{totalSavings}</p>
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
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(expense._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => confirmDelete(expense)} // Pass full expense details to delete confirmation
                    >
                      Delete
                    </button>
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

      {/* Delete confirmation popup */}
      {deletePopup && expenseToDelete && (
        <div className="popup">
          <div className="popup-content">
            <p>Are you sure you want to delete this expense?</p>
            <p><strong>Amount:</strong> Rs.{expenseToDelete.amount}</p>
            <p><strong>Type:</strong> {expenseToDelete.type}</p>
            <p><strong>Category:</strong> {expenseToDelete.category}</p>
            <p><strong>Description:</strong> {expenseToDelete.desc? expenseToDelete.desc : "NULL"}</p>
            <button className="confirm-btn" onClick={handleDelete}>Yes</button>
            <button className="cancel-btn" onClick={closeDeletePopup}>No</button>
          </div>
        </div>
      )}

      {/* Success confirmation popup */}
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
