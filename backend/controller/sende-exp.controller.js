import nodemailer from 'nodemailer';
import { User } from "../model/user.model.js";


// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: 'webproject2026@gmail.com',
    pass: 'ftje ocbc ouff jrip', // Replace this with an environment variable in production
  },
});

// Backend endpoint to receive PDF and send email
export const send_exp_email = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      console.error('User ID is missing');
      return res.status(400).json({ message: 'User is not authenticated' });
    }

    const user = await User.findOne({ _id: userId }).select('name email');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const expensepdf = req.file; // Access the uploaded PDF file
    
    if (!expensepdf) {
      return res.status(400).json({ message: 'PDF file is required' });
    }

    // Setup email options
    const mailOptions = {
      from: 'webproject2026@gmail.com',
      to: user.email,
      subject: 'Your Expense Report',
      text: 'Please find attached your expense report.',
      attachments: [
        {
          filename: 'expense_report.pdf',
          content: expensepdf.buffer, // Use buffer from uploaded PDF file
          contentType: 'application/pdf',
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Expense report sent successfully to the email' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


