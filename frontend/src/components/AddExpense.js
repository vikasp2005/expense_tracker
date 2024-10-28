import React, { useState } from 'react';
import { addExpenseOrEarning } from '../api';
import '../styles.css';

const AddExpenseOrEarning = () => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Expense/Earning');
  const [category, setCategory] = useState('SELECT A CATEGORY');
  const [desc, setDesc] = useState('');
  const [eDate, setEDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [successPopup, setSuccessPopup] = useState(false); // Popup state

  // Expense and Earning categories
  const expenseCategories = ['Food', 'Transport', 'Entertainment', 'Health', 'Other', 'Travel'];
  const earningCategories = ['Salary', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
  
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await addExpenseOrEarning({ amount, type, category, desc, date: eDate });
      setSuccessPopup(true); // Show success popup
      setTimeout(() => setSuccessPopup(false), 2000); // Auto-hide after 2 seconds
  
      // Clear form fields after successful submission
      setAmount('');
      setCategory('SELECT A CATEGORY');
      setDesc('');
      setEDate(new Date().toISOString().split('T')[0]);
      setFormErrors({});
      setType('Expense/Earning');
      setError('');
    } catch (err) {
      setError('Failed to add ' + type.toLowerCase());
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!amount || amount < 1) {
      errors.amount = 'Amount must be at least 1';
    }
    if (type === 'Expense/Earning') {
      errors.type = 'Please select either Expense or Earning';
    }
    if (category === 'SELECT A CATEGORY') {
      errors.category = 'Please select a category';
    }
    const today = new Date().toISOString().split('T')[0];
    if (eDate > today) {
      errors.Date = 'Date cannot be in the future';
    }
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

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      if (!value || value < 1) {
        newErrors.amount = 'Amount must be at least 1';
      } else {
        delete newErrors.amount;
      }
      return newErrors;
    });
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setEDate(value);
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      const today = new Date().toISOString().split('T')[0];
      if (value > today) {
        newErrors.Date = 'Date cannot be in the future';
      } else {
        delete newErrors.Date;
      }
      return newErrors;
    });
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setType(value);
    setCategory('SELECT A CATEGORY'); // Reset category when type changes

    setFormErrors((prev) => {
      const newErrors = { ...prev };
      if (value === 'Expense/Earning') {
        newErrors.type = 'Please select either Expense or Earning';
      } else {
        delete newErrors.type;
      }
      return newErrors;
    });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);

    setFormErrors((prev) => {
      const newErrors = { ...prev };
      if (value === 'SELECT A CATEGORY') {
        newErrors.category = 'Please select a category';
      } else {
        delete newErrors.category;
      }
      return newErrors;
    });
  };

  return (
    
    <div className="card">
      <h2>Add {type}</h2>
      {error && <p className="error-message">{error}</p>}
      {successPopup && <div className="success-popup">{type} added successfully!</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Type</label>
          <select value={type} onChange={handleTypeChange} className={formErrors.type ? 'error-input' : ''}>
            <option value="Expense/Earning">SELECT Expense/Earning</option>
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
            onChange={handleAmountChange}
            className={formErrors.amount ? 'error-input' : ''}
          />
          {formErrors.amount && <p className="error-message">{formErrors.amount}</p>}
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={category}
            onChange={handleCategoryChange}
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
          <label>Date</label>
          <input
            type="date"
            value={eDate}
            onChange={handleDateChange}
            className={formErrors.Date ? 'error-input' : ''}
          />
          {formErrors.Date && <p className="error-message">{formErrors.Date}</p>}
        </div>

        <button type="submit">Add {type}</button>
      </form>
    </div>
  );
};

export default AddExpenseOrEarning;
