import axios from 'axios';

const API_URL = 'http://localhost:5000/api/exp';

// Get all expenses
export const fetchExpenses = async () => {
    const response = await axios.post(`${API_URL}/disp_exp`);
    return response.data;
  };
  
// Fetch a single expense by ID
export const fetchExpenseById = async (id) => {
    const response = await axios.post(`${API_URL}/disp_exp_by_id/${id}`);
    return response.data.expense;
  };

  
// Add a new expense
export const addExpenseOrEarning = async (expense) => {
  return axios.post(`${API_URL}/add_exp`, expense);
};

// Update an expense
export const updateExpense = async (id, updatedExpense) => {
  return axios.put(`${API_URL}/edit_exp/${id}`, updatedExpense);
};

// Delete an expense
export const deleteExpense = async (id) => {
  return axios.delete(`${API_URL}/delete_exp/${id}`);
};
