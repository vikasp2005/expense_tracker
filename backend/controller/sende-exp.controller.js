import { User } from "../model/user.model.js";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import { Readable } from "stream";

// Configure nodemailer
// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    secureConnection : true,
    auth: {
      user: 'webproject2026@gmail.com',
      pass: 'ogws glsi ghgc ospm',
    },
  });

// Function to generate the PDF report as a buffer
const generateExpensePDF = (expenseData) => {
  const doc = new PDFDocument();
  const buffers = [];

  doc.text("Expense Report", { align: 'center' });
  doc.moveDown();
  doc.fontSize(10).text('Amount\t Type\t Category\t Description\t Date\n');
  
  expenseData.forEach(exp => {
    doc.text(
      `Rs.${exp.amount}\t ${exp.type}\t ${exp.category}\t ${exp.desc || "NULL"}\t ${new Date(exp.date).toLocaleDateString()}\n`
    );
  });

  // Collect the chunks in buffers array
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
    const  expense  = req.body;
    const userId = req.user.id;
    if (!expense || expense.length === 0) {
      return res.status(400).json({ message: 'No expenses available to send' });
    }

    // Fetch user's email from database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const pdfBuffer = await generateExpensePDF(expense);

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
