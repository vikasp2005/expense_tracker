import React, { useEffect, useState } from 'react';
import { updateExpense, fetchExpenseById } from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles.css';

const EditExpense = () => {
  const { id } = useParams();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Expense'); // Default type
  const [category, setCategory] = useState('SELECT A CATEGORY');
  const [desc, setDesc] = useState('');
  const [eDate, setEDate] = useState('');
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // For success popup
  const navigate = useNavigate();

  // Expense and Earning categories
  const expenseCategories = ['Food', 'Transport', 'Entertainment', 'Health', 'Other', 'Travel'];
  const earningCategories = ['Salary', 'Other'];

  useEffect(() => {
    const getExpense = async () => {
      try {
        
        const expense = await fetchExpenseById(id);
        setAmount(expense.amount);
        setType(expense.type); // Set type based on fetched data
        setCategory(expense.category);
        setDesc(expense.desc);
        setEDate(expense.date.split('T')[0]); // Pre-fill date correctly
      } catch (err) {
        setError('Failed to load expense');
      }
    };

    getExpense();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await updateExpense(id, { amount, type, category, desc, date: eDate });
      // Show success popup
      setShowSuccessPopup(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/view-expenses');
      },2000);
     
    } catch (err) {
      setError('Failed to update expense');
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!amount || amount < 1) errors.amount = 'Amount must be at least 1';
    if (type === 'Expense/Earning') errors.type = 'Please select either Expense or Earning';
    if (category === 'SELECT A CATEGORY') errors.category = 'Please select a category';
    const today = new Date().toISOString().split('T')[0];
    if (eDate > today) errors.Date = 'Date cannot be in the future';
    return errors;
  };

  // Dynamically change category options based on selected type
  const getCategoryOptions = () => {
    if (type === 'Expense') {
      return expenseCategories;
    } else if (type === 'Earning') {
      return earningCategories;
    }
    return [];
  };

  return (
    <div className="card">
      <h2>Edit {type}</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Type</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setCategory('SELECT A CATEGORY'); // Reset category when type changes
            }}
            className={formErrors.type ? 'error-input' : ''}
          >
            <option value="Expense">Expense</option>
            <option value="Earning">Earning</option>
          </select>
          {formErrors.type && <p className="error-message">{formErrors.type}</p>}
        </div>

        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={formErrors.amount ? 'error-input' : ''}
          />
          {formErrors.amount && <p className="error-message">{formErrors.amount}</p>}
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={formErrors.category ? 'error-input' : ''}
            disabled={type === 'Expense/Earning'} // Disable if type is not selected
          >
            <option value="SELECT A CATEGORY">SELECT A CATEGORY</option>
            {getCategoryOptions().map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {formErrors.category && <p className="error-message">{formErrors.category}</p>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Expense Date</label>
          <input
            type="date"
            value={eDate}
            onChange={(e) => setEDate(e.target.value)}
            className={formErrors.Date ? 'error-input' : ''}
          />
          {formErrors.Date && <p className="error-message">{formErrors.Date}</p>}
        </div>

        <button type="submit">Update Expense</button>
      </form>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Expense Updated Successfully!</h3>
            <p>You will be redirected shortly.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditExpense;
