import React, { useEffect, useState, useCallback } from 'react';
import { fetchExpenses, deleteExpense , sendExpensesEmail} from '../api';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar, Doughnut } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import '../styles.css'; // Import the CSS file

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
  const [noExpensePopup, setNoExpensePopup] = useState(false); // New state for no expense popup
  const [emailPopup, setEmailPopup] = useState({ show: false, message: '' });
  const [monthlyData, setMonthlyData] = useState(Array(12).fill({ earnings: 0, expenses: 0 }));
  const [loadingPopup, setLoadingPopup] = useState(false); // State for loading popup



  



  // Filter states
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [period, setPeriod] = useState('All');

  const navigate = useNavigate();


  const calculatePeriodDates = (selectedPeriod) => {
    const currentDate = new Date();
    let start = '';
    let end = new Date();

    switch (selectedPeriod) {
      case 'Last week':
        start = new Date(currentDate.setDate(currentDate.getDate() - 7));
        break;
      case 'Last month':
        start = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        break;
      case 'Last 2 months':
        start = new Date(currentDate.setMonth(currentDate.getMonth() - 2));
        break;
      case 'Last 6 months':
        start = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
        break;
      case 'Last year':
        start = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
        break;
      default:
        start = '';
        end = '';
        break;
    }
    
    setStartDate(start);
    setEndDate(end);
  };

  const calculateMonthlyData = useCallback((expenses) => {
    const newMonthlyData = Array(12).fill({ earnings: 0, expenses: 0 });
    expenses.forEach(expense => {
      const month = new Date(expense.date).getMonth();
      if (expense.type === 'Earning') {
        newMonthlyData[month] = {
          ...newMonthlyData[month],
          earnings: newMonthlyData[month].earnings + expense.amount,
        };
      } else {
        newMonthlyData[month] = {
          ...newMonthlyData[month],
          expenses: newMonthlyData[month].expenses + expense.amount,
        };
      }
    });
    setMonthlyData(newMonthlyData);
  },[]);


  const barChartData = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
      {
        label: 'Earnings',
        data: monthlyData.map(data => data.earnings),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Expenses',
        data: monthlyData.map(data => data.expenses),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Savings',
        data: monthlyData.map(data => data.earnings - data.expenses),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

// Helper function to check if a date is in the current month
const isCurrentMonth = (dateString) => {
  const date = new Date(dateString);
  const currentDate = new Date();
  return (
    date.getMonth() === currentDate.getMonth() &&
    date.getFullYear() === currentDate.getFullYear()
  );
};

// Filter expenses to only include those from the current month
const currentMonthExpenses = expenses.filter(expense =>
  isCurrentMonth(expense.date)
);

// Prepare the pie chart data based on current month expenses
const pieChartData = {
  labels: currentMonthExpenses.map(expense => expense.category),
  datasets: [
    {
      data: currentMonthExpenses.map(expense => expense.amount),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 100, 0, 0.6)',
        'rgba(0, 0, 255, 0.6)',
        'rgba(255 , 0, 0, 0.6)',
        'rgba(0, 255, 0, 0.6)',
      ],
    },
  ],
};


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

      let totalExp = 0;
      let totalEarn = 0;
      const categoryData = {};

      response.expenses.forEach(expense => {
        if (expense.type === 'Expense') {
          totalExp += expense.amount;
          categoryData[expense.category] = (categoryData[expense.category] || 0) + expense.amount;
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
  }, [typeFilter,  categoryFilter, minAmount, maxAmount, startDate, endDate]);

  useEffect(() => {
    if (period !== 'Custom') {
      calculatePeriodDates(period);
    }
  }, [period]);

  useEffect(() => {
    fetchFilteredExpenses();
  }, [fetchFilteredExpenses]);

  useEffect(()=>{
    calculateMonthlyData(expenses);
  },[calculateMonthlyData,expenses]);





  const handleDelete = async () => {
    try {
      await deleteExpense(expenseToDelete._id);
      setExpenses(expenses.filter(exp => exp._id !== expenseToDelete._id));
      fetchFilteredExpenses();

      setDeletePopup(false);
      setConfirmDeletePopup(true);
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

  const closeNoExpensePopup = () => {
    setNoExpensePopup(false);
  };


  

  
  const generatePDF = async () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text("Expense Report", 20, 10);
    
    // Add totals section
    doc.setFontSize(14);
    doc.text("Summary", 20, 20);
    doc.autoTable({
      startY: 25,
      body: [
        ['Total Earnings', `Rs.${totalEarnings}`],
        ['Total Expenses', `Rs.${totalExpenses}`],
        ['Total Savings', `Rs.${totalSavings}`]
      ],
      theme: 'grid',
      styles: { fillColor: [41, 128, 185] },
    });
  
    // Track current Y position to avoid overlapping
    let currentY = doc.lastAutoTable.finalY + 10;
  
    // Capture and add bar chart
    const barChartElement = document.querySelector('.bar canvas');
    if (barChartElement) {
      const barChartCanvas = await html2canvas(barChartElement);
      const barChartImage = barChartCanvas.toDataURL('image/png');
      doc.addImage(barChartImage, 'PNG', 15, currentY, 180, 90);
      currentY += 100; // Update Y position after the bar chart
    }
  
    // Capture and add pie chart
    const pieChartElement = document.querySelector('.pie canvas');
    if (pieChartElement) {
      const pieChartCanvas = await html2canvas(pieChartElement);
      const pieChartImage = pieChartCanvas.toDataURL('image/png');
      doc.addImage(pieChartImage, 'PNG', 15, currentY, 180, 90);
      currentY += 100; // Update Y position after the pie chart
    }
  
    // Add table for expenses
    doc.setFontSize(14);
    doc.text("Expense Details", 20, currentY + 10); // Positioning the table below the charts
    doc.autoTable({
      startY: currentY + 20,
      head: [['Amount', 'Type', 'Category', 'Description', 'Date']],
      body: expenses.map(expense => [
        `Rs.${expense.amount}`,
        expense.type,
        expense.category,
        expense.desc || "N/A",
        formatDate(expense.date)
      ]),
      theme: 'striped'
    });
  
      // Generate and return the PDF Blob
  return new Promise((resolve) => {
    const pdfBlob = doc.output('blob'); // Generate Blob from PDF content
    resolve(pdfBlob);
  });
  };
  

  const downloadPDF = async () => {
    setLoadingPopup(true); // Show loading popup
  try
  {
    const pdfBlob = await generatePDF();
    const url = URL.createObjectURL(pdfBlob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expense_report.pdf';
    document.body.appendChild(a);
    a.click();
  
    URL.revokeObjectURL(url); // Clean up the URL object after download
    document.body.removeChild(a);
  }
  catch (err) {
    setEmailPopup({ show: true, message: "Failed to send email." });
  } finally {
    setLoadingPopup(false); // Hide loading popup
  }
  };
  
  
  

  const sendEmail = async () => {
    setLoadingPopup(true); // Show loading popup

  
     if (expenses.length === 0) {
      setNoExpensePopup(true);
      return;
    }


    try {

      const pdfBlob = await generatePDF();

      // Create a FormData object to send binary data
      const formData = new FormData();
      formData.append("pdf", pdfBlob, "expense_report.pdf"); // append file with name and filename

      const response = await sendExpensesEmail(formData); // Call the backend API to send the email
      if (response.status === 200) {
        setEmailPopup({ show: true, message: "Expenses report sent to your email successfully!" });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setEmailPopup({ show: true, message: "Failed to send expenses report email." });
    }
    finally {
      setLoadingPopup(false); // Hide loading popup
    }
 
  };


  const closeEmailPopup = () => setEmailPopup({ show: false, message: '' });




 

  return (
    <div>


      {/* Left: Bar Chart */}  
      <div className="bar">
        <Bar data={barChartData} options={{ responsive: true }} />
      

      <div className='pie'>
      <Doughnut data={pieChartData} options={{ responsive: true }} />
      </div>
      </div>


      <div className="card">
      
        <h2>Expense List</h2>

        
        <div className="actions">
          <button onClick={downloadPDF} className="pdf-button">Download PDF</button>
          <button  onClick={sendEmail} className="email-button">Send to Email</button>
        </div>


        {error && <p className="error-message">{error}</p>}

        <div className="totals">
          <div className="total-card">
            <p>Total Earnings: Rs.{totalEarnings}</p>
          </div>
          <div className="total-card">
            <p>Total Expenses: Rs.{totalExpenses}</p>
          </div>
          <div className="total-card">
            <p>Total Savings: Rs.{totalSavings}</p>
          </div>
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

        <table className="table min-w-full bg-white">
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
                      className = "btn2-edit"
                      onClick={() => handleEdit(expense._id)}
                    />
                      
                    <MdDelete 
                      className = "btn2-delete"
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

{noExpensePopup && (
        <div className="popup">
          <div className="popup-content">
            <p>No expenses available to download.</p>
            <button className="confirm-btn" onClick={closeNoExpensePopup}>Close</button>
          </div>
        </div>
         )}

{emailPopup.show && (
          <div className="popup">
            <div className="popup-content">
              <p>{emailPopup.message}</p>
              <button className="confirm-btn" onClick={closeEmailPopup}>Close</button>
            </div>
          </div>
        )}

    {loadingPopup && <div className="loading-popup">Loading...</div>}
       
    
      

      
    </div>
  );
};

export default ExpenseTable;


