import { User } from "../model/user.model.js";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: 'webproject2026@gmail.com',
    pass: 'ogws glsi ghgc ospm',
  },
});

// Function to generate PDF in a tabular format
const generateExpensePDF = (expenseData) => {
    const doc = new PDFDocument();
    const buffers = [];
  
    // PDF Title
    doc.text("Expense Report", { align: 'center' });
    doc.moveDown();
  
    // Table headers
    const headers = ["Amount", "Type", "Category", "Description", "Date"];
    const headerHeight = 20;
    const rowHeight = 15;
  
    // Draw header
    headers.forEach((header, index) => {
      doc.rect(50 + index * 100, doc.y, 100, headerHeight).fill('#cccccc');
      doc.text(header, 50 + index * 100 + 5, doc.y + 5);
    });
    doc.moveDown(headerHeight);
  
    // Draw rows
    expenseData.forEach(exp => {
      const row = [
        `Rs.${exp.amount}`,
        exp.type,
        exp.category,
        exp.desc || "NULL",
        new Date(exp.date).toLocaleDateString(),
      ];
  
      row.forEach((cell, index) => {
        doc.rect(50 + index * 100, doc.y, 100, rowHeight).stroke();
        doc.text(cell, 50 + index * 100 + 5, doc.y + 5);
      });
      doc.moveDown(rowHeight);
    });
  
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.end();
  
    return new Promise((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (error) => reject(error));
    });
  };
  

// Endpoint to send expense PDF report to user's email
export const send_exp_email = async (req, res) => {
  try {
    const expense = req.body;
    const userId = req.user.id;

    if (!expense || expense.length === 0) {
      return res.status(400).json({ message: 'No expenses available to send' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const pdfBuffer = await generateExpensePDF(expense);

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

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Expense report sent successfully to your email' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Server error');
  }
};
