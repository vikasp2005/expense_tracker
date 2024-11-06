import axios from 'axios';

const API_URL = 'https://expense-tracker-backend-kjza.onrender.com/api/exp';
const API_AUTH_URL = 'https://expense-tracker-backend-kjza.onrender.com/api/auth';


const token = () => {
  return localStorage.getItem('token')
};


export const register = async(user) => {
  return axios.post(`${API_AUTH_URL}/register`, user);

};

export const verifyotp = async(otp) =>{

  return axios.post(`${API_AUTH_URL}/verify`, otp);

};

export const sendExpensesEmail = async(expence) => {

  return axios.post(`${API_URL}/send-expenses-email`,  expence,{
    headers: {
      'x-auth-token': token() // Pass the token in the headers
    }
});
};

export const login = async(login_data) => {
  return axios.post(`${API_AUTH_URL}/login`, login_data);
};


// Get all expenses
export const fetchExpenses = async (expense) => {
    const response = await axios.post(`${API_URL}/disp_exp`,expense ,{
      headers: {
        'x-auth-token': token() // Pass the token in the headers
      }
});
    return response.data;
  };
  
// Fetch a single expense by ID
export const fetchExpenseById = async (id) => {
  const response = await axios.post(`${API_URL}/disp_exp_by_id/${id}`,id,{
    headers: {
      'x-auth-token': token()  // Pass the token in the headers
    }
  });
    return response.data.expense;
  };

  
// Add a new expense
export const addExpenseOrEarning = async (expense) => {
  return axios.post(`${API_URL}/add_exp`, expense,{
    headers: {
      'x-auth-token': token()  // Pass the token in the headers
    }
});
};

// Update an expense
export const updateExpense = async (id, updatedExpense) => {
  return axios.put(`${API_URL}/edit_exp/${id}`, updatedExpense,{
    headers: {
      'x-auth-token': token()  // Pass the token in the headers
    }
});
};

// Delete an expense
export const deleteExpense = async (id) => {
  return axios.delete(`${API_URL}/delete_exp/${id}`,{
    headers: {
      'x-auth-token': token()  // Pass the token in the headers
    }
});
};

export const getProfile = async() => {
  
      const response = await axios.get(`${API_URL}/user`,{
        headers: {
          'x-auth-token': token()  // Pass the token in the headers
        }
      });
      return response.data.user;
        
    
};



