import { User } from "../model/user.model.js";
import nodemailer from "nodemailer";
import puppeteer from "puppeteer";

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: 'webproject2026@gmail.com',
    pass: 'ogws glsi ghgc ospm', // Replace with your actual password (not recommended to store in code)
  },
});

// Generate HTML with Chart.js for pie chart and table
const generateExpenseHTML = (expenseData, totalExpenses, totalEarnings, totalSavings) => {
  const total = totalExpenses + totalEarnings + totalSavings; // Total for pie chart calculation

  // Calculate percentages
  const expensePercentage = Math.round((totalExpenses / total) * 100);
  const earningPercentage = Math.round((totalEarnings / total) * 100);
  const savingsPercentage = Math.round((totalSavings / total) * 100);

  let expenseRows = expenseData.map(exp => `
    <tr>
      <td>Rs.${exp.amount}</td>
      <td>${exp.type}</td>
      <td>${exp.category}</td>
      <td>${exp.desc || "NULL"}</td>
      <td>${new Date(exp.date).toLocaleDateString()}</td>
    </tr>
  `).join('');

  return `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; }
        h2 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 8px 12px; border: 1px solid #ccc; text-align: left; }
        .summary { text-align: center; margin-top: 20px; display: flex; justify-content: center; gap: 20px; }
        .card {
          background-color: #fff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
          width: 150px;
        }
        .summary div { font-size: 16px; margin: 5px 0; }
        .pie-chart { text-align: center; margin-top: 30px; }
      </style>
    </head>
    <body>
      <h2>Expense Report</h2>
      
      <div class="summary">
        <div class="card">
          <h3>Total Expenses</h3>
          <div>Rs.${totalExpenses}</div>
        </div>
        <div class="card">
          <h3>Total Earnings</h3>
          <div>Rs.${totalEarnings}</div>
        </div>
        <div class="card">
          <h3>Total Savings</h3>
          <div>Rs.${totalSavings}</div>
        </div>
      </div>

      <div class="pie-chart">
        <canvas id="myChart"></canvas>
      </div>

      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Type</th>
            <th>Category</th>
            <th>Description</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${expenseRows}
        </tbody>
      </table>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <script>
        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Expenses', 'Earnings', 'Savings'],
            datasets: [{
              data: [${expensePercentage}, ${earningPercentage}, ${savingsPercentage}],
              backgroundColor: ['#ff6384', '#36a2eb', '#4bc0c0'],
              hoverOffset: 4
            }]
          },
          options: {
            responsive: true, // Adjust chart based on screen size
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Expense Breakdown'
              }
            }
          }
        });
      </script>
    </body>
    </html>
  `;
};


// Convert HTML to PDF using puppeteer and send email
export const send_exp_email = async (req, res) => {
  try {
    const expenseData = req.body;
    const userId = req.user.id;

    if (!expenseData || expenseData.length === 0) {
      return res.status(400).json({ message: 'No expenses available to send' });
    }

    // Fetch user's email from the database
    const user = await User.findById(userId, 'name email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate summary
    const totalExpenses = expenseData.filter(exp => exp.type === 'Expense').reduce((sum, exp) => sum + exp.amount, 0);
    const totalEarnings = expenseData.filter(exp => exp.type === 'Earning').reduce((sum, exp) => sum + exp.amount, 0);
    const totalSavings = totalEarnings - totalExpenses;

    // Generate HTML
    const expenseHTML = generateExpenseHTML(expenseData, totalExpenses, totalEarnings, totalSavings);

    // Convert HTML to PDF with puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(expenseHTML, { waitUntil: 'networkidle0' });

    // Wait for the chart to render before converting to PDF
    await page.waitForSelector('#myChart');

    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    // Setup email options
    const mailOptions = {
      from: 'webproject2026@gmail.com',
      to: user.email,
      subject: 'Your Expense Report',
      text: 'Please find attached your expense report.',
      attachments: [
        {
          filename: 'expense_report.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Expense report sent successfully to your email' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Server error');
  }
};
