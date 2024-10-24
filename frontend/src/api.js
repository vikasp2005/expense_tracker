import axios from 'axios';

const API_URL = 'http://localhost:5000/api/exp';

const token = localStorage.getItem('token');


// Get all expenses
export const fetchExpenses = async (expense) => {
    const response = await axios.post(`${API_URL}/disp_exp`,expense ,{
      headers: {
        'x-auth-token': token  // Pass the token in the headers
      }
});
    return response.data;
  };
  
// Fetch a single expense by ID
export const fetchExpenseById = async (id) => {
    const response = await axios.post(`${API_URL}/disp_exp_by_id/${id}`,{
      headers: {
        'x-auth-token': token  // Pass the token in the headers
      }
});
    return response.data.expense;
  };

  
// Add a new expense
export const addExpenseOrEarning = async (expense) => {
  return axios.post(`${API_URL}/add_exp`, expense,{
    headers: {
      'x-auth-token': token  // Pass the token in the headers
    }
});
};

// Update an expense
export const updateExpense = async (id, updatedExpense) => {
  return axios.put(`${API_URL}/edit_exp/${id}`, updatedExpense,{
    headers: {
      'x-auth-token': token  // Pass the token in the headers
    }
});
};

// Delete an expense
export const deleteExpense = async (id) => {
  return axios.delete(`${API_URL}/delete_exp/${id}`,{
    headers: {
      'x-auth-token': token  // Pass the token in the headers
    }
});
};
